import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.delete(
        `http://localhost:8080/app-eauto/backend/admin-deleteproduct.php?id=${id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        setSuccess("Product deleted successfully!");
        setTimeout(() => navigate("/admin/manage-products"), 1500);
      } else {
        setError(res.data.message || "Failed to delete product.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("You are not authorized. Please log in as admin.");
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        setError("Error deleting product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg border-0 w-100" style={{ maxWidth: "500px" }}>
        <div className="card-body text-center p-4">
          <div className="mb-3">
            <i className="bi bi-trash3-fill text-danger" style={{ fontSize: "3rem" }}></i>
          </div>
          <h3 className="mb-3 text-danger fw-bold">Delete Product</h3>
          <p className="text-muted">
            This action <strong>cannot</strong> be undone. Are you sure you want to
            permanently delete product <strong>ID: {id}</strong>?
          </p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              className="btn btn-danger btn-lg px-4"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </button>
            <button
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => navigate("/admin/manage-products")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
