import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaUsers, FaBox, FaRupeeSign } from "react-icons/fa";

const StatCard = ({ icon, title, value, subtitle, delay, color }) => (
  <div className="col-md-6 col-xl-3" data-aos="fade-up" data-aos-delay={delay}>
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background: "linear-gradient(135deg, #ffffff, #f3f8fc)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: color,
            width: "50px",
            height: "50px",
            color: "#fff",
            fontSize: "1.4rem",
          }}
        >
          {icon}
        </div>
        <div>
          <h6 className="text-secondary fw-medium mb-1">{title}</h6>
          <h3 className="fw-bold mb-0">{value}</h3>
          <small className={subtitle?.includes("↑") ? "text-success" : "text-muted"}>
            {subtitle}
          </small>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 700, once: true });

    async function fetchStats() {
      try {
        const response = await fetch(
          "http://localhost:8080/app-eauto/backend/admin-dashboard.php"
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
      {/* Header */}
      <div
        className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-4 rounded-3 shadow-sm mb-4 gap-3"
        data-aos="fade-down"
      >
        <h5 className="mb-0 fw-bold">Welcome, Admin</h5>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          style={{ maxWidth: "250px" }}
        />
      </div>

      {/* Loader */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {/* Stats */}
      {!loading && !error && (
        <div className="row g-4">
          {[
            {
              icon: <FaShoppingCart />,
              title: "Total Orders",
              value: stats?.totalOrders?.toLocaleString(),
              subtitle: "Since last month",
              delay: 100,
              color: "#0d6efd",
            },
            {
              icon: <FaRupeeSign />,
              title: "Total Revenue",
              value: `₹${stats?.totalRevenue?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              subtitle: "↑ 32% since last month",
              delay: 200,
              color: "#198754",
            },
            {
              icon: <FaUsers />,
              title: "Total Users",
              value: stats?.totalUsers?.toLocaleString(),
              subtitle: "Since last month",
              delay: 300,
              color: "#ffc107",
            },
            {
              icon: <FaBox />,
              title: "Total Products",
              value: stats?.totalProducts?.toLocaleString(),
              subtitle: "All available items",
              delay: 400,
              color: "#dc3545",
            },
          ].map((stat, index) => (
            <StatCard key={stat.title || index} {...stat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
