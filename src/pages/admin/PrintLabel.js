import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const PrintLabel = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetched = useRef(false); // Prevent double fetch in Strict Mode
  const [printed, setPrinted] = useState(false); // Prevent double print alert

  // Calculate subtotal safely
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const discountRate = 0.05; // 5% discount
  const discountAmount = subtotal * discountRate;
  const grandTotal = subtotal - discountAmount;

  // Order number for barcode
  const orderNumber = order?.id || order?._id || "000000";
  const barcodeData = `ORDER-${String(orderNumber).padStart(6, "0")}`;
  const qrData = order
    ? `${order.fullname}, ${order.address}, ₹${order.total_amount}`
    : "";

  useEffect(() => {
    if (fetched.current) return; // Already fetched once
    fetched.current = true;

    async function fetchOrder() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/app-eauto/backend/admin-printlabel.php?orderId=${orderId}`
        );
        if (!res.ok) throw new Error("Failed to fetch order.");
        const data = await res.json();
        setOrder(data.order);
        setItems(data.items || []);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }

    if (orderId) fetchOrder();
  }, [orderId]);

  // Print on load with alert, only once
  useEffect(() => {
    if (order && !printed) {
      setPrinted(true);
      alert("⚠️ Make sure your printer is connected and has paper.");
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [order, printed]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <div>Loading order details...</div>
      </div>
    );

  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  if (!order) return <div className="text-center">Order not found.</div>;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "2rem",
        maxWidth: 600,
        margin: "2rem auto",
        backgroundColor: "#fff",
        border: "2px solid #000",
        borderRadius: 8,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        animation: "zoomIn 0.5s ease",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        <span style={{ color: "#f68b1e", fontWeight: "bold" }}>Shipping Label</span>
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Order: #{String(orderNumber).padStart(6, "0")}
        </div>
        <div>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(
              qrData
            )}`}
            alt="QR Code"
            style={{ marginTop: 10 }}
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <img
          src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(
            barcodeData
          )}&code=Code128&dpi=96`}
          alt="Barcode"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      <table style={{ width: "100%", marginBottom: 20, fontSize: "0.95rem" }}>
        <tbody>
          <tr>
            <td>
              <strong>Name:</strong>
            </td>
            <td>{order.fullname}</td>
          </tr>
          <tr>
            <td>
              <strong>Phone:</strong>
            </td>
            <td>{order.phone}</td>
          </tr>
          <tr>
            <td>
              <strong>Address:</strong>
            </td>
            <td>{order.address}</td>
          </tr>
          <tr>
            <td>
              <strong>City:</strong>
            </td>
            <td>{order.city}</td>
          </tr>
          <tr>
            <td>
              <strong>State / ZIP:</strong>
            </td>
            <td>
              {order.state} - {order.zip}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Order Total:</strong>
            </td>
            <td>₹{Number(order.total_amount).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <strong>Products:</strong>
        <table
          style={{
            width: "100%",
            marginTop: 10,
            borderCollapse: "collapse",
            fontSize: "0.95rem",
          }}
        >
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th style={{ padding: 6, borderBottom: "1px solid #ddd" }}>Product</th>
              <th style={{ padding: 6, borderBottom: "1px solid #ddd" }}>Qty</th>
              <th style={{ padding: 6, borderBottom: "1px solid #ddd" }}>Price</th>
              <th style={{ padding: 6, borderBottom: "1px solid #ddd" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 0;
              const total = price * quantity;
              return (
                <tr key={item.id || item.product_id || index}>
                  <td style={{ padding: 6, borderBottom: "1px solid #ddd" }}>
                    {item.product_name}
                  </td>
                  <td style={{ padding: 6, borderBottom: "1px solid #ddd" }}>{quantity}</td>
                  <td style={{ padding: 6, borderBottom: "1px solid #ddd" }}>
                    ₹{price.toFixed(2)}
                  </td>
                  <td style={{ padding: 6, borderBottom: "1px solid #ddd" }}>
                    ₹{total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={3} style={{ textAlign: "right", padding: 6 }}>
                Subtotal
              </td>
              <td style={{ padding: 6 }}>₹{subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ textAlign: "right", padding: 6 }}>
                Discount (5%)
              </td>
              <td style={{ padding: 6 }}>-₹{discountAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ fontWeight: "bold", textAlign: "right", padding: 6 }}>
                Grand Total
              </td>
              <td style={{ fontWeight: "bold", padding: 6 }}>₹{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <img
            src="https://cdn.shopify.com/s/files/1/0415/7846/3390/files/eauto-app-logo_x320.jpg?v=1631018743"
            alt="eAuto Logo"
            width={80}
            height={80}
            style={{ borderRadius: 8, display: "block", margin: "0 auto" }}
          />
        </a>
      </div>

      <div
        id="print-note"
        style={{
          textAlign: "center",
          marginTop: 20,
          color: "#dc3545",
          fontWeight: "bold",
          display: "block",
        }}
      >
        📌 Note: Please check printer settings before continuing.
      </div>

      <style>{`
        @media print {
          #print-note { display: none; }
          body { background-color: white; margin: 0; }
        }
        @keyframes zoomIn {
          from {transform: scale(0.95); opacity: 0;}
          to {transform: scale(1); opacity: 1;}
        }
      `}</style>
    </div>
  );
};

export default PrintLabel;
