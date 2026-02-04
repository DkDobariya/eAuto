// src/components/CartDropdown.js
import React from 'react';
import { Link } from 'react-router-dom';

const CartDropdown = ({ cartItems, cartCount, cartTotal }) => {
  return (
    <div
      className="cart-dropdown position-absolute bg-white text-dark p-3 shadow rounded"
      style={{ width: '300px', right: 0, top: '110%', zIndex: 1050 }}
    >
      {cartItems.length === 0 ? (
        <div className="text-center">
          <svg viewBox="0 0 100 100" width="80" height="80" className="mb-2">
            <g transform="translate(0 2)" strokeWidth="4" stroke="#1e2d7d" fill="none" strokeLinecap="square" fillRule="evenodd">
              <circle cx="34" cy="60" r="6"></circle>
              <circle cx="67" cy="60" r="6"></circle>
              <path d="M22.9 15h54.8l-4.3 30H30.3L19.6 0H1"></path>
            </g>
          </svg>
          <p className="fw-bold mt-2">Your cart is empty</p>
          <Link to="/" className="btn btn-sm btn-info text-white mt-2">Shop now</Link>
        </div>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className="d-flex mb-2">
              <img
                src={`http://localhost:8080/app-eauto/uploads/${item.image}`}
                alt={item.product_name}
                width="60"
                height="60"
                className="me-2 rounded"
              />
              <div>
                <div className="fw-bold">{item.product_name}</div>
                <div className="text-muted small">{item.brand}</div>
                <div className="text-muted small">
                  Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                </div>
                <div className="fw-semibold">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="d-grid gap-2 mt-3">
            <Link to="/cart" className="btn btn-sm btn-primary fw-bold">View Cart</Link>
            <Link to="/checkout" className={`btn btn-sm btn-info text-white fw-bold ${cartCount === 0 ? 'disabled' : ''}`}>Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
