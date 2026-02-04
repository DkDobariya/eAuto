// src/components/ManageProducts.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaFilter,
  FaRedoAlt,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManageProducts() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/app-eauto/backend/admin-manageproducts.php";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    brand: "",
    mainBrand: "",
    price: "",
    original: "",
    discount: "",
    rating: "",
    reviews: "",
    stock: "In Stock",
    image: "",
  });
  const [editing, setEditing] = useState(false);
  const [filterBrand, setFilterBrand] = useState("All Brands");
  const [filterStock, setFilterStock] = useState("All Stock Status");

  const imageInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data || []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}/${form.id}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchProducts();
      resetForm();
    } catch {
      setError("Failed to save product");
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      brand: "",
      mainBrand: "",
      price: "",
      original: "",
      discount: "",
      rating: "",
      reviews: "",
      stock: "In Stock",
      image: "",
    });
    setEditing(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const exportToExcel = () => {
    const data = products.map((p) => ({
      ID: p.id,
      Name: p.name,
      Brand: p.brand,
      MainBrand: p.mainBrand,
      Price: p.price,
      Original: p.original,
      Discount: p.discount,
      Rating: p.rating,
      Reviews: p.reviews,
      Stock: p.stock,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

  // filter by mainBrand + stock
  const filteredProducts = products.filter((p) => {
    if (filterBrand !== "All Brands" && p.mainBrand !== filterBrand) return false;
    if (filterStock !== "All Stock Status" && p.stock !== filterStock) return false;
    return true;
  });

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Manage Products</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={exportToExcel}>
            <FaFileExcel className="me-2" /> Export
          </button>
          <button className="btn btn-primary" onClick={resetForm}>
            <FaPlus className="me-2" /> New
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body row g-2 align-items-center">
          <div className="col-md-3">
            <label className="form-label small mb-1">Main Brand</label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="form-select"
            >
              <option>All Brands</option>
              {["BRAND B", "Hero", "Honda"].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small mb-1">Stock</label>
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="form-select"
            >
              <option>All Stock Status</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>

          <div className="col-md-3 d-grid">
            <label className="form-label small mb-1">&nbsp;</label>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                /* trigger re-render (filters already applied via filteredProducts) */
              }}
            >
              <FaFilter className="me-2" /> Apply
            </button>
          </div>

          <div className="col-md-3 d-grid">
            <label className="form-label small mb-1">&nbsp;</label>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setFilterBrand("All Brands");
                setFilterStock("All Stock Status");
              }}
            >
              <FaRedoAlt className="me-2" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={addProduct} className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">{editing ? "Edit Product" : "Add New Product"}</h5>

        <div className="row g-2 mb-3">
          <div className="col-md">
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col-md">
            <input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="form-control"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-md">
            <input
              placeholder="Original Price"
              type="number"
              value={form.original}
              onChange={(e) => setForm({ ...form, original: e.target.value })}
              className="form-control"
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-md">
            <input
              placeholder="Discount"
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className="form-control"
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-md">
            <input
              placeholder="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md">
            <input
              placeholder="Main Brand"
              value={form.mainBrand}
              onChange={(e) => setForm({ ...form, mainBrand: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col-md">
            <input
              placeholder="Rating"
              type="number"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="form-control"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
          <div className="col-md">
            <input
              placeholder="Reviews"
              type="number"
              value={form.reviews}
              onChange={(e) => setForm({ ...form, reviews: e.target.value })}
              className="form-control"
              min="0"
              step="1"
            />
          </div>
          <div className="col-md">
            <select
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="form-select"
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
          <div className="col-md">
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="form-control"
              accept="image/*"
            />
          </div>
        </div>

        {/* Image preview */}
        {form.image && (
          <img
            src={
              form.image.startsWith("data:")
                ? form.image
                : `http://localhost:8080/app-eauto/uploads/${form.image}`
            }
            alt={form.name || "Preview"}
            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/fallback.jpg";
            }}
          />
        )}

        <div>
          <button type="submit" className="btn btn-success me-2">
            {editing ? "Update Product" : "Add Product"}
          </button>
          <button type="button" onClick={resetForm} className="btn btn-outline-secondary">
            Clear
          </button>
        </div>
      </form>

      {/* Product List */}
      <div className="card p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Product List</h5>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status" />
            <div className="mt-2 text-muted">Loading products…</div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div
            className="table-responsive"
            style={{ maxHeight: "65vh", overflow: "auto" }}
          >
            <table className="table table-striped table-bordered align-middle mb-0">
              <thead
                className="table-light"
                style={{ position: "sticky", top: 0, zIndex: 10 }}
              >
                <tr>
                  <th style={{ width: 60 }}>ID</th>
                  <th style={{ width: 80 }}>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Main Brand</th>
                  <th>Price</th>
                  <th>Original</th>
                  <th>Discount</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>Stock</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>
                        {p.image ? (
                          <img
                            src={`http://localhost:8080/app-eauto/uploads/${p.image}`}
                            alt={p.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/fallback.jpg";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              background: "#f3f3f3",
                              borderRadius: 6,
                            }}
                          />
                        )}
                      </td>
                      <td>{p.name}</td>
                      <td>{p.brand}</td>
                      <td>{p.mainBrand}</td>
                      <td>{p.price}</td>
                      <td>{p.original}</td>
                      <td>{p.discount}</td>
                      <td>{p.rating}</td>
                      <td>{p.reviews}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => navigate(`/admin/delete-product/${p.id}`)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="text-center py-4 text-muted"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
