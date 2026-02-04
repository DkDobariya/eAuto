// src/pages/user/Hero.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./Products.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Hero = () => {
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const products = [
    { id: 1, product_name: "Ensons Petrol Tank for Hero HF Deluxe 2016 (Black/Red)", price: 4120, original_price: 6170, discount_amount: 2050, image: "p10.jpg", brand: "ENSONS", rating: 5, reviews: 7, stock_status: "In Stock" },
    { id: 2, product_name: "Front Fork Pipe for Hero Splendor, Passion, CD Dawn, Glamour", price: 1610, original_price: 2420, discount_amount: 810, image: "p11.jpg", brand: "ENDURANCE", rating: 3, reviews: 3, stock_status: "In Stock" },
    { id: 3, product_name: "Engine Belt for Honda Activa Old | Dio | Maestro", price: 640, original_price: 910, discount_amount: 270, image: "p12.jpg", brand: "OES ENGINE BELT", rating: 1, reviews: 1, stock_status: "Sold Out" },
    { id: 4, product_name: "Gear Pinion Set for Hero Maestro | Gear Assembly", price: 1890, original_price: 2700, discount_amount: 810, image: "p13.jpg", brand: "EAUTO", rating: 1, reviews: 1, stock_status: "In Stock" },
    { id: 5, product_name: "Carburetor Repair Kit for Hero Splendor", price: 640, original_price: 850, discount_amount: 210, image: "p14.jpg", brand: "EAUTO", rating: 5, reviews: 7, stock_status: "Sold Out" },
    { id: 6, product_name: "Crank Shaft Assembly for Hero Splendor", price: 2190, original_price: 3800, discount_amount: 1610, image: "p15.jpg", brand: "EAUTO", rating: 4, reviews: 10, stock_status: "Sold Out" },
    { id: 7, product_name: "Rolon Chain Sprocket Kit for Hero Xtreme/Xpulse", price: 1740, original_price: 2436, discount_amount: 696, image: "p16.jpg", brand: "ROLON", rating: 2, reviews: 2, stock_status: "In Stock" },
    { id: 8, product_name: "Clutch Plate for Hero Karizma R / ZMR", price: 750, original_price: 1050, discount_amount: 300, image: "p17.jpg", brand: "OES CLUTCH PLATE", rating: 5, reviews: 5, stock_status: "In Stock" },
    { id: 9, product_name: "Rear Shock Absorber for Hero Hunk | Karizma ZMR", price: 2970, original_price: 8800, discount_amount: 5830, image: "p18.jpg", brand: "SANRI ENGINEERING", rating: 4, reviews: 20, stock_status: "In Stock" }
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
      <h2 className="text-center fw-bold mb-5">Hero Products</h2>
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

export default Hero;