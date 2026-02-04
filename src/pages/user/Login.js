import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8080/app-eauto/backend/login-action.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      const result = await response.json();
      setLoading(false);

      if (result.status === 'success') {
        localStorage.setItem('user', JSON.stringify(result.user));
        window.dispatchEvent(new Event('userUpdated'));
        navigate('/my-profile');
      } else {
        setErrorMsg(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Server error. Please try again later.');
      console.error('Login Error:', err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
      <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '420px', width: '100%' }} data-aos="zoom-in">
        <h2 className="mb-4 text-center text-primary">Login</h2>

        {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

        {/* Fixed form: removed invalid 'auo' attribute */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#00c8f8' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-3 text-center" style={{ fontSize: '14px' }}>
          New user? <Link to="/register" style={{ color: '#00c8f8' }}>Create your account</Link><br />
          Admin? <a href="/admin/login" style={{ color: '#00c8f8' }} target="_blank" rel="noopener noreferrer">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
