// src/pages/admin/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    original_price: "",
    discount_amount: "",
    image: "",
    brand: "",
    main_brand: "",
    rating: "",
    reviews: "",
    stock_status: "In Stock",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch product details
  useEffect(() => {
    axios
      .get(`http://localhost:8080/app-eauto/backend/admin-editproduct.php?id=${id}`)
      .then((res) => {
        if (res.data.success && res.data.product) {
          setFormData(res.data.product);
        } else {
          setError(res.data.message || "Product not found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product data.");
        setLoading(false);
      });
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    axios
      .post("http://localhost:8080/app-eauto/backend/admin-editproduct.php", { id, ...formData })
      .then((res) => {
        if (res.data.success) {
          navigate("/admin/manage-products");
        } else {
          setError(res.data.message || "Failed to update product.");
        }
        setSubmitting(false);
      })
      .catch(() => {
        setError("Failed to update product.");
        setSubmitting(false);
      });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading product...</div>;
  }

  return (
    <div className="container mt-4">
      <h3>Edit Product</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Product Name */}
          <div className="col-md-4">
            <label htmlFor="product_name" className="form-label">
              Product Name <span className="text-danger">*</span>
            </label>
            <input
              id="product_name"
              type="text"
              name="product_name"
              className="form-control"
              value={formData.product_name}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          {/* Price */}
          <div className="col-md-2">
            <label htmlFor="price" className="form-label">
              Price <span className="text-danger">*</span>
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          {/* Original Price */}
          <div className="col-md-2">
            <label htmlFor="original_price" className="form-label">
              Original Price
            </label>
            <input
              id="original_price"
              type="number"
              min="0"
              step="0.01"
              name="original_price"
              className="form-control"
              value={formData.original_price || ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Discount Amount */}
          <div className="col-md-2">
            <label htmlFor="discount_amount" className="form-label">
              Discount Amount
            </label>
            <input
              id="discount_amount"
              type="number"
              min="0"
              step="0.01"
              name="discount_amount"
              className="form-control"
              value={formData.discount_amount || ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Image */}
          <div className="col-md-2">
            <label htmlFor="image" className="form-label">
              Image URL
            </label>
            <input
              id="image"
              type="text"
              name="image"
              className="form-control"
              value={formData.image}
              onChange={handleChange}
              disabled={submitting}
            />
            {formData.image && (
              <img
                src={`http://localhost:8080/app-eauto/uploads/${formData.image}`}
                alt={formData.product_name}
                className="img-thumbnail mt-2"
                style={{ maxWidth: "150px", height: "120px", objectFit: "contain" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback.jpg";
                }}
              />
            )}
          </div>

          {/* Brand */}
          <div className="col-md-3">
            <label htmlFor="brand" className="form-label">
              Brand <span className="text-danger">*</span>
            </label>
            <input
              id="brand"
              type="text"
              name="brand"
              className="form-control"
              value={formData.brand}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          {/* Main Brand */}
          <div className="col-md-3">
            <label htmlFor="main_brand" className="form-label">
              Main Brand <span className="text-danger">*</span>
            </label>
            <select
              id="main_brand"
              name="main_brand"
              className="form-select"
              value={formData.main_brand}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="">Select Main Brand</option>
              <option value="BRAND B">BRAND B</option>
              <option value="Hero">Hero</option>
              <option value="Honda">Honda</option>
            </select>
          </div>

          {/* Rating */}
          <div className="col-md-2">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              name="rating"
              className="form-control"
              value={formData.rating || ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Reviews */}
          <div className="col-md-2">
            <label htmlFor="reviews" className="form-label">
              Reviews
            </label>
            <input
              id="reviews"
              type="number"
              min="0"
              name="reviews"
              className="form-control"
              value={formData.reviews || ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Stock Status */}
          <div className="col-md-2">
            <label htmlFor="stock_status" className="form-label">
              Stock Status
            </label>
            <select
              id="stock_status"
              name="stock_status"
              className="form-select"
              value={formData.stock_status}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="In Stock">In Stock</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-md-2 align-self-end">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
