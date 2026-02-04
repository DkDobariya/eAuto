// src/pages/user/Orders.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [fullname, setFullname] = useState('Guest');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });

    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setFullname(userData.fullname || 'Guest');
      fetchOrders(userData._id || userData.id);
    }

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/app-eauto/backend/orders.php?user_id=${userId}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:8080/app-eauto/backend/logout.php',
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar text-white" data-aos="fade-right" style={sidebarStyle}>
        <h5 className="text-center mb-4">Hello {fullname.split(' ')[0]}</h5>
        <Link to="/my-profile" className="sidebar-link">Profile</Link>
        <Link to="/orders" className="sidebar-link active">My Orders</Link>
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
        <h3 className="text-primary mb-4">My Orders</h3>

        {orders.length === 0 ? (
          <div className="text-center">
            <div className="empty-box display-1 text-muted mb-3">📦</div>
            <p className="text-muted fs-5">
              You haven't placed any orders yet.<br />
              Grab it now, tomorrow it might be gone forever.
            </p>
            <Link to="/" className="btn btn-info text-white px-4">Shop now</Link>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              className="order-box bg-white border p-3 rounded mb-3 shadow-sm"
              key={order._id || index}
            >
              <strong>Order #{order.id || order._id}</strong><br />
              <small className="text-muted">{formatDate(order.created_at)}</small>
              <div className="mt-2 mb-1">
                Total: <strong>₹{parseFloat(order.total_amount || 0).toFixed(2)}</strong>
              </div>
              <Link
                to={`/order-details/${order._id || order.id}`}
                className="btn btn-sm btn-outline-primary"
              >
                View Details
              </Link>
            </div>
          ))
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
  border: none;
  background: none;
  text-align: left;
  width: 100%;
}
.sidebar-link:hover,
.sidebar-link.active {
  background-color: #01b8f0;
}
.logout-btn {
  color: #ff4d4d;
}
.logout-btn:hover {
  background-color: #ff6666 !important;
  color: #fff !important;
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

export default Orders;
