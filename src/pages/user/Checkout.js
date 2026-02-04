import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fname: '',
    lname: '',
    address1: '',
    address2: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
    phone: '',
    payment: 'cod',
  });

  // Init AOS once on mount
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      startEvent: 'DOMContentLoaded',
    });
  }, []);

  // Fetch user and cart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, cartRes] = await Promise.all([
          fetch('http://localhost:8080/app-eauto/backend/login-action.php', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('http://localhost:8080/app-eauto/backend/cart.php', {
            credentials: 'include',
          }),
        ]);

        const userData = await userRes.json();
        const cartData = await cartRes.json();

        if (!userData || userData.status !== 'success') {
          return navigate('/login?redirect=checkout');
        }

        if (!Array.isArray(cartData) || cartData.length === 0) {
          return navigate('/cart?empty=1');
        }

        setUser(userData.user);
        setCart(cartData);

        // Refresh AOS after setting data
        setTimeout(() => AOS.refresh(), 100);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Refresh AOS again when cart or user updates
  useEffect(() => {
    if (cart.length && user) {
      AOS.refresh();
    }
  }, [cart, user]);

  const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const discount = total * 0.05;
  const finalTotal = total - discount;

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Normalize cart to always use MongoDB _id
  const normalizedCart = cart.map((item) => ({
    id: item._id || item.id || item.product_id, // ✅ fix for undefined id
    product_name: item.product_name || item.name,
    quantity: Number(item.quantity),
    price: Number(item.price),
    image: item.image || null,
    brand: item.brand || null,
  }));

  console.log("Sending cart:", normalizedCart); // debug in browser

  const orderData = {
    ...form,
    user_id: user.id,
    email: user.email,
    cart: normalizedCart,   // ✅ send normalized version
    total: finalTotal,
  };

  try {
      const res = await fetch('http://localhost:8080/app-eauto/backend/place-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.status === 'success') {
        navigate(`/order-success/${result.order_id}`);
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Server error');
      console.error(err);
    }
  };

  if (loading || !user) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4" data-aos="zoom-in">
        <img
          src="https://cdn.shopify.com/s/files/1/0415/7846/3390/files/eauto-app-logo_x320.jpg?v=1631018743"
          alt="eAuto Logo"
          className="img-fluid rounded mb-2"
          style={{ width: '80px', height: '80px' }}
        />
        <h3>Checkout</h3>
      </div>

      <div className="row">
        {/* Delivery Form */}
        <div className="col-md-7 mb-4" data-aos="fade-right">
          <div className="card p-4 shadow-sm">
            <h5>Delivery Information</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" value={user?.email || ''} readOnly />
              </div>

              <div className="row">
                <div className="col">
                  <input
                    placeholder="First name"
                    required
                    className="form-control mb-3"
                    value={form.fname}
                    onChange={(e) => setForm({ ...form, fname: e.target.value })}
                  />
                </div>
                <div className="col">
                  <input
                    placeholder="Last name"
                    required
                    className="form-control mb-3"
                    value={form.lname}
                    onChange={(e) => setForm({ ...form, lname: e.target.value })}
                  />
                </div>
              </div>

              <input
                placeholder="Flat no., Building, Apartment"
                required
                className="form-control mb-3"
                value={form.address1}
                onChange={(e) => setForm({ ...form, address1: e.target.value })}
              />
              <input
                placeholder="Area, Colony, Landmark"
                className="form-control mb-3"
                value={form.address2}
                onChange={(e) => setForm({ ...form, address2: e.target.value })}
              />

              <div className="row">
                <div className="col">
                  <input
                    placeholder="City"
                    required
                    className="form-control mb-3"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div className="col">
                  <select
                    required
                    className="form-select mb-3"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  >
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
                <div className="col">
                  <input
                    placeholder="Pin Code"
                    required
                    className="form-control mb-3"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  />
                </div>
              </div>

              <input
                placeholder="Phone number"
                required
                className="form-control mb-3"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <div className="mb-3">
                <label>Payment Method</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={form.payment === 'cod'}
                      onChange={(e) => setForm({ ...form, payment: e.target.value })}
                    />
                    <label className="form-check-label">COD</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      value="online"
                      checked={form.payment === 'online'}
                      onChange={(e) => setForm({ ...form, payment: e.target.value })}
                    />
                    <label className="form-check-label">Online</label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100" data-aos="zoom-in-up">
                Pay Now
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-5" data-aos="fade-left">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Order Summary</h5>
            {cart.map((item, index) => (
              <div
                key={item.id || item.product_id || index}
                className="d-flex align-items-center mb-3"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={`http://localhost:8080/app-eauto/uploads/${item.image}`}
                  onError={(e) => (e.target.src = '/fallback.jpg')}
                  width="70"
                  height="70"
                  style={{ borderRadius: '8px', objectFit: 'contain' }}
                  alt={item.product_name}
                />
                <div className="flex-grow-1 ms-3">
                  <div><strong>{item.product_name}</strong></div>
                  <div className="text-muted">Qty: {item.quantity}</div>
                </div>
                <div><strong>₹{(item.price * item.quantity).toFixed(2)}</strong></div>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-success">
              <span>Discount (5%)</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
