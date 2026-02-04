import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Prevent page scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/app-eauto/backend/admin-login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("admin_email", data.admin_email);
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.loginBox} data-aos="fade-up">
          <h3 className="mb-4 text-center" style={styles.title}>
            <FaLock className="me-2" /> Admin Login
          </h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={styles.inputWithIcon}
                  required
                />
                <span
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn w-100"
              style={{
                ...styles.btnPrimary,
                opacity: loading ? 0.8 : 1,
                pointerEvents: loading ? "none" : "auto",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Links */}
            <div style={styles.footerLinks}>
              <p className="mt-3 mb-1">
                Login as user?{" "}
                <a href="/login" style={styles.link}>
                  User Login Page
                </a>
              </p>
              <p className="mb-0">
                New admin?{" "}
                <a href="/admin/register" style={styles.link}>
                  Admin Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(to right, #11216c, #01b8f0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "20px",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "450px",
  },
  loginBox: {
    background: "#fff",
    padding: "35px 30px",
    borderRadius: "12px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.15)",
    width: "100%",
  },
  title: {
    color: "#1b2c7a",
    fontWeight: 600,
  },
  btnPrimary: {
    backgroundColor: "#01b8f0",
    border: "none",
    color: "#fff",
    padding: "10px",
    fontWeight: 500,
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },
  footerLinks: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#555",
  },
  link: {
    color: "#01b8f0",
    textDecoration: "none",
    fontWeight: 500,
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#6c757d",
    fontSize: "1.1rem",
    padding: "4px",
  },
  inputWithIcon: {
    paddingRight: "2.5rem",
  },
};

export default AdminLogin;
