import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Alert,
  Card,
  Image,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 👇 your PHP backend URL
  const API_BASE = 'http://localhost:8080/app-eauto/backend';

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/cart.php`);
      const cartData = response.data || [];
      setItems(cartData);
      calculateTotal(cartData);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (data) => {
    const totalAmount = data.reduce((acc, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return acc + price * quantity;
    }, 0);
    setTotal(totalAmount);
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await axios.post(`${API_BASE}/cart.php`, { updateQty: 1, id, qty });
      fetchCartItems();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.get(`${API_BASE}/cart.php?remove=${id}`);
      fetchCartItems();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      console.warn('No items to checkout.');
      return;
    }
    navigate('/checkout');
  };

  return (
    <Container className="py-5">
      <h3
        className="fw-bold mb-4 text-center text-md-start"
        data-aos="fade-down"
      >
        🛒 My Cart
      </h3>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading cart...</p>
        </div>
      )}

      {/* Empty Cart */}
      {items.length === 0 && !loading && (
        <Alert variant="warning" className="text-center">
          Your cart is empty!{' '}
          <Button variant="link" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Alert>
      )}

      <Row>
        <Col md={8} data-aos="fade-right">
          <Card className="mb-4 shadow-sm p-4">
            <h5 className="mb-3">Items</h5>
            <Table responsive borderless>
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th style={{ width: '180px' }}>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = parseFloat(item.price) || 0;
                  const quantity = parseInt(item.quantity) || 1;
                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <Image
                            src={`http://localhost:8080/app-eauto/uploads/${item.image}`}
                            onError={(e) => (e.target.src = '/fallback.jpg')}
                            width="70"
                            height="70"
                            rounded
                          />
                          <div>
                            <small className="text-uppercase text-muted fw-semibold">
                              {item.brand}
                            </small>
                            <br />
                            <strong>{item.product_name}</strong>
                            <br />
                            <span className="text-primary fw-semibold">
                              ₹{price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => updateQty(item._id, quantity - 1)}
                          >
                            -
                          </Button>
                          <Form.Control
                            type="text"
                            value={quantity}
                            readOnly
                            style={{ width: '50px', textAlign: 'center' }}
                          />
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => updateQty(item._id, quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="link"
                          className="text-danger mt-2 p-0"
                          onClick={() => removeItem(item._id)}
                        >
                          Remove
                        </Button>
                      </td>
                      <td>
                        <strong>₹{(quantity * price).toFixed(2)}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col md={4} data-aos="fade-left">
          <Card className="p-4 shadow-sm mb-4">
            <h5 className="fw-bold d-flex justify-content-between text-primary">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </h5>

            <div className="mb-3">
              <Form.Label className="fw-semibold text-primary">
                Order Instructions
              </Form.Label>
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => setInstructionsVisible(!instructionsVisible)}
              >
                {instructionsVisible ? '▴ Hide' : '▾ Show'}
              </Button>
              {instructionsVisible && (
                <>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    className="mt-2 border-info"
                    placeholder="Leave your delivery instructions here..."
                  />
                  <Button variant="primary" className="mt-2">
                    Save
                  </Button>
                </>
              )}
            </div>

            <p className="text-muted small">
              Tax included. <a href="#">Shipping</a> calculated at checkout.
            </p>

            <Button
              variant="info"
              className="w-100 text-white"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Card>

          <Card className="text-center p-3 shadow-sm">
            <p className="fw-semibold text-primary mb-1">
              Over 100,000+ Happy Customers
            </p>
            <p className="text-muted">
              <i className="bi bi-lock"></i> 100% Secure Payments
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
