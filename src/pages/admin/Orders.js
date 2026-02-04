import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaSearch, FaTrash, FaPrint } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const fetchOrders = async (searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/app-eauto/backend/admin-order.php",
        { params: { search: searchTerm } }
      );
      // Ensure every order has a unique id
      const ordersData = response.data.orders?.map((o) => ({
        ...o,
        id: o.id || o._id || Math.random().toString(36).substr(2, 9),
      })) || [];
      setOrders(ordersData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(search.trim());
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setDeletingId(orderId);
    try {
      await axios.delete(`http://localhost:8080/app-eauto/backend/admin-order.php/${orderId}`);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete order.");
    }
    setDeletingId(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateStr).toLocaleString("en-IN", options);
  };

  return (
    <div className="container-fluid" style={{ paddingLeft: 0 }}>
      <div className="row" style={{ minHeight: "100vh" }}>
        <main className="col-12 px-md-4 py-4">
          {/* Header & Search */}
          <div className="d-flex justify-content-between align-items-center mb-4" data-aos="fade-down">
            <h3 className="mb-0">
              {search ? <>Search Results for: <em>{search}</em></> : "All Orders"}
            </h3>
            <form
              className="d-flex"
              role="search"
              onSubmit={handleSearch}
              style={{ gap: "0.5rem", flexWrap: "wrap" }}
            >
              <input
                type="text"
                name="search"
                className="form-control w-auto"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <FaSearch className="me-1" /> Search
              </button>
              {search && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearch("");
                    fetchOrders();
                  }}
                >
                  Reset
                </button>
              )}
            </form>
          </div>

          {/* Orders Table */}
          <div className="table-responsive bg-white p-4 rounded shadow-sm" data-aos="fade-up">
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <div>Loading orders...</div>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
              <table className="table table-bordered table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Order Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.fullname}</td>
                        <td>{order.email}</td>
                        <td>{order.phone}</td>
                        <td>
                          {order.payment_method?.toUpperCase() === "COD"
                            ? "Cash on Delivery (COD)"
                            : "Online (UPI/Card)"}
                        </td>
                        <td>
                          ₹
                          {Number(order.total_amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>
                          <a
                            href={`/admin/print-label/${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary me-1 mb-1"
                          >
                            <FaPrint /> Print
                          </a>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="btn btn-sm btn-outline-danger mb-1"
                            disabled={deletingId === order.id}
                          >
                            {deletingId === order.id ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <FaTrash />
                            )}{" "}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        {search ? `No results for '${search}'.` : "No orders found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;
