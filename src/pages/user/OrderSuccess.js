import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderSuccess = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/app-eauto/backend/ordersuccess.php?id=${orderId}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (data.status === "error") {
          setError(data.message || "Order not found");
          return;
        }

        // Normalize the order ID for display
        const normalizedOrder = {
          ...data.order,
          id: data.order._id?.$oid || orderId,
          created_at: data.order.created_at
            ? new Date(data.order.created_at)
            : null,
        };

        setOrder(normalizedOrder);
        setItems(data.items ?? []);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading)
    return <div className="text-center py-5">⏳ Loading order details...</div>;

  if (error)
    return (
      <div className="container text-center py-5 text-danger">
        ❌ {error}
        <div className="mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );

  // Prefer backend-calculated total, fallback to recalculation
  const totalPaid =
    order?.calculated_total ??
    items.reduce((acc, item) => acc + (item.totalPaid || 0), 0);

  const discountedTotal = totalPaid * 0.95; // 5% discount

  return (
    <div className="container bg-white p-4 rounded shadow-sm my-5">
      <div className="text-center mb-4">
        <h3 className="text-success">✅ Order Placed Successfully!</h3>
        <p className="text-muted">Order ID: #{order.id}</p>
      </div>

      <div className="mb-4">
        <strong>Customer:</strong> {order.fullname || "N/A"} <br />
        <strong>Email:</strong> {order.email || "N/A"} <br />
        <strong>Phone:</strong> {order.phone || "N/A"} <br />
        <strong>Address:</strong>{" "}
        {[order.address, order.city, order.state, order.zip]
          .filter(Boolean)
          .join(", ")}{" "}
        <br />
        <strong>Payment Method:</strong> {order.payment_method || "N/A"} <br />
        <strong>Placed on:</strong>{" "}
        {order.created_at ? order.created_at.toLocaleString() : "N/A"}
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Qty</th>
              <th>Price Paid</th>
              <th>Total Paid</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>
                    <img
                      src={item.imageUrl || "/fallback.jpg"}
                      alt={item.productName || "Product"}
                      className="img-thumbnail"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback.jpg";
                      }}
                    />
                  </td>
                  <td>{item.productName || "N/A"}</td>
                  <td>{item.brand || "N/A"}</td>
                  <td>{item.quantity}</td>
                  <td>₹{(item.pricePaid || 0).toFixed(2)}</td>
                  <td>₹{(item.totalPaid || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No items found for this order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-4">
        <h5>Total Paid (5% Discount Applied): ₹{discountedTotal.toFixed(2)}</h5>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/orders")}
        >
          🎉 Thank you for your purchase!
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
