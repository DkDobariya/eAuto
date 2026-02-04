// src/pages/user/Header.js
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEnvelope } from 'react-icons/fa';
import CartDropdown from './CartDropdown';
import './Header.css';

const Header = () => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [category, setCategory] = useState('');
  const [user, setUser] = useState(null);
  const [hideBanner, setHideBanner] = useState(false);

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        setUser(parsed && parsed.fullname ? parsed : null);
      } catch (err) {
        console.error("Error parsing user data:", err);
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener('userUpdated', loadUser);

    return () => window.removeEventListener('userUpdated', loadUser);
  }, []);

  const fetchCart = () => {
    fetch('http://localhost:8080/app-eauto/backend/cart.php')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setCartItems(items);
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
        setCartTotal(items.reduce((sum, item) => sum + item.quantity * item.price, 0));
      })
      .catch((err) => console.error('Error fetching cart:', err));
  };

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCart(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearch = () => {
    const routes = { Bajaj: '/bajaj', Hero: '/hero', Honda: '/honda' };
    if (routes[category]) {
      navigate(routes[category]);
    } else {
      alert('Please select a valid category.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const firstName = user?.fullname?.split(' ')[0] || 'Guest';

  return (
    <>
      {/* Top Banner */}
      {!hideBanner && (
        <div className="top-banner d-flex justify-content-between align-items-center px-3 py-2 bg-dark text-white">
          <div className="small">
            🚚 <strong>Prepaid = 5% OFF + Priority Shipping!</strong>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="text-white text-decoration-none small d-flex align-items-center gap-2">
              <FaEnvelope /> <span>Subscribe & Save</span>
            </Link>
            <button
              onClick={() => setHideBanner(true)}
              className="btn-close btn-close-white btn-sm"
              aria-label="Close"
            />
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar navbar-expand-md navbar-dark bg-primary sticky-top">
        <div className="container-fluid px-3">
          <Link className="navbar-brand fw-bold" to="/">eAuto ⚙</Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            {/* Search */}
            <div className="d-flex flex-grow-1 ms-md-3 me-md-3 my-2 my-md-0" style={{ maxWidth: '600px' }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search for parts..."
              />
              <select
                className="form-select form-select-sm mx-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                <option value="Bajaj">Bajaj</option>
                <option value="Hero">Hero</option>
                <option value="Honda">Honda</option>
              </select>
              <button className="btn btn-light btn-sm" onClick={handleSearch}>🔍</button>
            </div>

            {/* User and Cart */}
            <div className="d-flex align-items-center ms-auto mt-2 mt-md-0">
              {/* User Dropdown */}
              <div className="dropdown me-3" ref={userDropdownRef}>
                {user ? (
                  <>
                    <button
                      className="btn btn-outline-light dropdown-toggle btn-sm fw-bold"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      aria-expanded={userDropdownOpen}
                      type="button"
                    >
                      👤 {firstName}
                    </button>
                    <ul className={`dropdown-menu dropdown-menu-end ${userDropdownOpen ? 'show' : ''}`}>
                      <li>
                        <Link className="dropdown-item" to="/my-profile" onClick={() => setUserDropdownOpen(false)}>
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/orders" onClick={() => setUserDropdownOpen(false)}>
                          My Orders
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleLogout();
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <Link to="/login" className="btn btn-outline-light btn-sm fw-bold">
                    Login / Signup
                  </Link>
                )}
              </div>

              {/* Cart Icon */}
              <div className="position-relative" ref={dropdownRef}>
                <button className="btn btn-outline-light btn-sm" onClick={() => setShowCart(!showCart)} type="button">
                  <FaShoppingCart />
                  <span className="badge bg-danger ms-1">{cartCount}</span>
                </button>
                {showCart && (
                  <CartDropdown
                    cartItems={cartItems}
                    cartCount={cartCount}
                    cartTotal={cartTotal}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
