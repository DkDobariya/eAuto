import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';

const MyProfile = () => {
  const [profile, setProfile] = useState({
    fullname: '',
    email: '',
    contact: '',
    birthdate: '',
    gender: 'Male',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });

    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8080/app-eauto/backend/profile-action.php', {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success || res.data.status === 'success') {
          setProfile(res.data.user || res.data.data || res.data);
        } else {
          setErrorMsg(res.data.message || 'Failed to load profile.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Profile fetch failed:', err);
        setErrorMsg('Failed to load profile. Please login again.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    axios
      .post('http://localhost:8080/app-eauto/backend/profile-action.php', profile, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success || res.data.status === 'success') {
          setSuccessMsg('Profile updated successfully.');
        } else {
          setErrorMsg(res.data.message || 'Update failed.');
        }
      })
      .catch((err) => {
        console.error('Update failed:', err);
        setErrorMsg('Update failed. Please try again.');
      });
  };

  // Logout function calls backend and redirects
  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:8080/app-eauto/backend/logout.php', // backend logout endpoint
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken'); // clear local storage token if any
      navigate('/login');
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar text-white" data-aos="fade-right" style={sidebarStyle}>
        <h5 className="text-center mb-4">
          Hello {profile.fullname?.split(' ')[0] || 'Guest'}
        </h5>
        <Link to="/MyProfile" className="active sidebar-link">Profile</Link>
        <Link to="/orders" className="sidebar-link">My Orders</Link>

        {/* Logout button styled exactly like links */}
        <button
          onClick={logout}
          type="button"
          className="sidebar-link logout-btn"
        >
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="main" data-aos="fade-up" style={mainStyle}>
        <h3 className="text-primary mb-4">My Profile</h3>

        {loading && <div className="alert alert-info">Loading profile...</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullname"
                className="form-control"
                value={profile.fullname}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email (readonly)</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={profile.email}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact No</label>
              <input
                type="text"
                name="contact"
                className="form-control"
                value={profile.contact}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Birthdate</label>
              <input
                type="date"
                name="birthdate"
                className="form-control"
                value={profile.birthdate ? profile.birthdate.slice(0, 10) : ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={profile.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button type="submit" className="btn btn-save me-2">Save</button>
            <Link to="/MyProfile" className="btn btn-cancel">Cancel</Link>
          </form>
        )}
      </div>
    </>
  );
};

// Sidebar styling
const sidebarStyle = {
  width: '230px',
  backgroundColor: '#11216c',
  height: '100vh',
  position: 'fixed',
  top: '110px',
  left: 0,
  padding: '20px',
  zIndex: 1000,
};

// Main content styling
const mainStyle = {
  marginLeft: '230px',
  padding: '40px',
  backgroundColor: '#f4f6f9',
  minHeight: '100vh',
};

// Embedded CSS
const styles = `
.sidebar-link {
  display: block;
  padding: 12px 15px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  border-radius: 4px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
  border: none;       /* Remove button border */
  background: none;   /* Remove button background */
  text-align: left;   /* Align text left */
  width: 100%;        /* Full width */
  // cursor: pointer;    /* Pointer cursor */
}
.sidebar-link:hover,
.sidebar-link.active {
  background-color: #01b8f0;
}

/* Logout button color overrides */
.logout-btn {
  color: #ff4d4d; /* bright red */
}

.logout-btn:hover {
  background-color: #ff6666 !important;
  color: #fff !important;
}

.btn-save {
  background-color: #01b8f0 !important;
  color: #fff !important;
}
.btn-save:hover {
  background-color: #019ad1 !important;
}
.btn-cancel {
  background-color: #1b2c7a !important;
  color: #fff !important;
}
.btn-cancel:hover {
  background-color: #0d1a4f !important;
}

@media (max-width: 768px) {
  .sidebar {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
  }
  .main {
    margin-left: 0 !important;
    padding: 20px !important;
  }
}
`;

export default MyProfile;
