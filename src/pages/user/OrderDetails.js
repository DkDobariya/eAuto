import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  useEffect(() => {
    if (!orderId || !orderId.trim()) {
      setErrorMessage('Invalid order ID. Please check the link.');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8080/app-eauto/backend/order-details.php?id=${orderId}`
        );
        const data = await res.json();
        console.log('API Response:', data);

        if (data.status === 'success') {
          // Convert MongoDB _id objects to strings
          const cleanOrder = { ...data.order, _id: data.order._id?.$oid || data.order._id };
          const cleanItems = (data.items || []).map(item => ({
            ...item,
            _id: item._id?.$oid || item._id
          }));

          setOrder(cleanOrder);
          setItems(cleanItems);
          setErrorMessage('');
        } else {
          setOrder(null);
          setItems([]);
          setErrorMessage(data.message || 'Order not found.');
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setOrder(null);
        setItems([]);
        setErrorMessage('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const parseDate = (mongoDate) => {
    if (!mongoDate) return "N/A";
    // MongoDB date may come as { $date: { $numberLong: "timestamp" } }
    if (mongoDate.$date?.$numberLong) return new Date(Number(mongoDate.$date.$numberLong)).toLocaleString();
    return new Date(mongoDate).toLocaleString();
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.order_price) || 0;
      return sum + qty * price;
    }, 0);
    return subtotal * 0.95; // 5% discount
  };

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;

  if (errorMessage)
    return (
      <div className="container mt-5 text-center text-danger">
        {errorMessage}
        <div className="mt-3">
          <Link to="/orders" className="btn btn-secondary">Back to Orders</Link>
        </div>
      </div>
    );

  return (
    <div className="container bg-white p-4 rounded shadow mt-5" data-aos="fade-up">
      <h3 className="text-primary mb-4">
        Order #{order.id || order._id || 'N/A'} Details
      </h3>

      <div className="mb-4">
        <p><strong>Customer:</strong> {order.fullname || '-'}</p>
        <p><strong>Email:</strong> {order.email || '-'}</p>
        <p><strong>Phone:</strong> {order.phone || '-'}</p>
        <p>
          <strong>Address:</strong> {order.address || '-'}, {order.city || '-'}, {order.state || '-'} - {order.zip || '-'}
        </p>
        <p><strong>Payment Method:</strong> {order.payment_method || '-'}</p>
        <p><strong>Placed on:</strong> {parseDate(order.created_at)}</p>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => {
              const qty = Number(item.quantity) || 0;
              const price = Number(item.order_price) || 0;
              return (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.product_image
                        ? `http://localhost:8080/app-eauto/uploads/${item.product_image}`
                        : '/placeholder.jpg'}
                      className="img-thumbnail"
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                      alt={item.product_name || 'Product'}
                    />
                  </td>
                  <td>{item.product_name || '-'}</td>
                  <td>{item.brand || '-'}</td>
                  <td>{qty}</td>
                  <td>₹{price.toFixed(2)}</td>
                  <td>₹{(qty * price).toFixed(2)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No items found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="text-end mt-4">
        <h5>Total Paid (5% Discount Applied): ₹{calculateTotal().toFixed(2)}</h5>
        <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderDetails;
