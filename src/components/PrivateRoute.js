import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
