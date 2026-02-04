// src/pages/user/Honda.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./Products.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Honda = () => {
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const products = [
    { id: 1, product_name: 'Techlon Starter Motor for Hero and Honda Scooters', price: 1040, original_price: 1287, discount_amount: 247, image: 'p19.jpg', brand: 'TECHLON', rating: 5, reviews: 7, stock_status: 'In Stock' },
    { id: 2, product_name: 'Engine Valve Set for Honda Activa 110', price: 500, original_price: 710, discount_amount: 210, image: 'p20.jpg', brand: 'OES ENGINE VALVE SET', rating: 4, reviews: 4, stock_status: 'Sold Out' },
    { id: 3, product_name: 'RR Unit for Honda CBR and Hero Karizma', price: 2310, original_price: 3470, discount_amount: 1160, image: 'p21.jpg', brand: 'OES RR UNIT', rating: 5, reviews: 9, stock_status: 'In Stock' },
    { id: 4, product_name: 'ROLON Chain Sprocket Kit for Honda CBR 250R', price: 2150, original_price: 3010, discount_amount: 860, image: 'p22.jpg', brand: 'ROLON', rating: 3, reviews: 3, stock_status: 'In Stock' },
    { id: 5, product_name: 'OES Wiring Harness for Honda Eterno 150', price: 1340, original_price: 1820, discount_amount: 480, image: 'p23.jpg', brand: 'OES WIRING', rating: 6, reviews: 6, stock_status: 'Sold Out' },
    { id: 6, product_name: 'Cam Shaft Assembly for Honda Activa 110 and Navi', price: 1280, original_price: 1792, discount_amount: 512, image: 'p24.jpg', brand: 'OES CAM SHAFT', rating: 5, reviews: 5, stock_status: 'In Stock' },
    { id: 7, product_name: 'Roller Weights for Honda Activa HET, Navi, Aviator', price: 565, original_price: 791, discount_amount: 226, image: 'p25.jpg', brand: 'OES ROLLER WEIGHTS', rating: 5, reviews: 5, stock_status: 'In Stock' },
    { id: 8, product_name: 'Lumax Tail Light Assembly for Honda CB Trigger', price: 1450, original_price: 1993, discount_amount: 543, image: 'p26.jpg', brand: 'LUMAX', rating: 1, reviews: 1, stock_status: 'In Stock' },
    { id: 9, product_name: 'Head Light Set for Honda CB Hornet 160R', price: 1460, original_price: 2150, discount_amount: 690, image: 'p27.jpg', brand: 'OES HEAD LIGHT SET', rating: 4, reviews: 31, stock_status: 'In Stock' }
  ];

  const handleAddToCart = async (product) => {
    try {
      setLoadingId(product.id);
      await axios.post("http://localhost:8080/app-eauto/backend/add_to_cart.php", product);
      navigate("/cart");
    } catch (error) {
      alert("Failed to add to cart");
    } finally {
      setLoadingId(null);
    }
  };

  const renderStars = (rating) => {
    const safeRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
    return (
      <>
        {[...Array(5)].map((_, i) =>
          i < safeRating ? <FaStar key={i} className="text-warning" /> : <FaRegStar key={i} className="text-warning" />
        )}
      </>
    );
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">Honda Products</h2>
      <div className="row g-4">
        {products.map((product, index) => (
          <div className="col-12 col-sm-6 col-md-4" key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="card h-100 shadow-sm border-0 hover-scale">
              <div className="position-relative">
                <img
                  src={`http://localhost:8080/app-eauto/uploads/${product.image}`}
                  alt={product.product_name}
                  className="card-img-top p-3"
                  style={{ height: "220px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback.jpg";
                  }}
                />
                {product.discount_amount > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-2 shadow">
                    -₹{product.discount_amount}
                  </span>
                )}
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="fw-semibold mb-2">{product.product_name}</h6>
                <div className="mb-2">
                  <span className="text-danger fw-bold">₹{product.price}</span>{" "}
                  <small className="text-muted text-decoration-line-through">₹{product.original_price}</small>
                </div>
                <div className="mb-2 d-flex align-items-center">
                  {renderStars(product.rating)}
                  <small className="text-muted ms-2">({product.reviews} reviews)</small>
                </div>
                <span
                  className={`badge rounded-pill mb-3 ${
                    product.stock_status === "In Stock" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {product.stock_status}
                </span>
                <button
                  className="btn btn-primary mt-auto"
                  disabled={product.stock_status !== "In Stock" || loadingId === product.id}
                  onClick={() => handleAddToCart(product)}
                >
                  {loadingId === product.id && <span className="spinner-border spinner-border-sm me-2"></span>}
                  {product.stock_status === "In Stock" ? "Add to Cart" : "Sold Out"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Honda;
