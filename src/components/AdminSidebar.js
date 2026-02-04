import React from "react";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaTachometerAlt, FaMotorcycle, FaShoppingCart, FaUsers, FaSignOutAlt } from "react-icons/fa";

import "./AdminSidebar.css";

const AdminSidebar = () => {
  React.useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <nav className="sidebar" data-aos="fade-right">
      <div className="sidebar-header">
        <h4>eAuto Admin</h4>
      </div>

      <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaTachometerAlt className="icon" /> Dashboard
      </NavLink>

      <NavLink to="/admin/manage-products" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaMotorcycle className="icon" /> Products
      </NavLink>

      <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaShoppingCart className="icon" /> Orders
      </NavLink>

      <NavLink to="/admin/customers" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaUsers className="icon" /> Customers
      </NavLink>

      <NavLink to="/admin/logout" className="text-danger">
        <FaSignOutAlt className="icon" /> Logout
      </NavLink>
    </nav>
  );
};

export default AdminSidebar;
