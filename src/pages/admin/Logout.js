import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear admin session/storage here
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
