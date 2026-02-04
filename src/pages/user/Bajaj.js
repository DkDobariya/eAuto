import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./Products.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Bajaj = () => {
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const products = [
    { id: 1, product_name: "MINDA Lock Set for Bajaj Pulsar 150CC 2 Pin", price: 799, original_price: 999, discount_amount: 200, image: "p1.jpg", brand: "Bajaj", rating: 5, reviews: 25, stock_status: "In Stock" },
    { id: 2, product_name: "GOETZE Piston Cylinder Kit for Bajaj Discover 100 | 47mm Dia", price: 1299, original_price: 1599, discount_amount: 300, image: "p2.jpg", brand: "Bajaj", rating: 5, reviews: 5, stock_status: "In Stock" },
    { id: 3, product_name: "ENDURANCE Rear Mono Shock Absorber for Bajaj Pulsar", price: 899, original_price: 1099, discount_amount: 200, image: "p3.jpg", brand: "Bajaj", rating: 4, reviews: 24, stock_status: "In Stock" },
    { id: 4, product_name: "MINDA Lock Set for Bajaj Pulsar 4 Pin", price: 699, original_price: 899, discount_amount: 200, image: "p4.jpg", brand: "Bajaj", rating: 1, reviews: 1, stock_status: "In Stock" },
    { id: 5, product_name: "ENDURANCE Clutch Cable for Bajaj Pulsar 220", price: 1499, original_price: 1699, discount_amount: 200, image: "p5.jpg", brand: "Bajaj", rating: 5, reviews: 18, stock_status: "In Stock" },
    { id: 6, product_name: "GOETZE Clutch Plate Set for Bajaj Avenger 220", price: 1199, original_price: 1399, discount_amount: 200, image: "p6.jpg", brand: "Bajaj", rating: 4, reviews: 11, stock_status: "Sold Out" },
    { id: 7, product_name: "Rolon Chain Sprocket Kit for Bajaj Pulsar 180", price: 1799, original_price: 1999, discount_amount: 200, image: "p7.jpg", brand: "Bajaj", rating: 5, reviews: 9, stock_status: "In Stock" },
    { id: 8, product_name: "Bajaj Genuine Front Brake Pads for Pulsar 200NS", price: 599, original_price: 799, discount_amount: 200, image: "p8.jpg", brand: "Bajaj", rating: 4, reviews: 7, stock_status: "In Stock" },
    { id: 9, product_name: "Bajaj Genuine Headlamp Assembly for Pulsar 220F", price: 1099, original_price: 1299, discount_amount: 200, image: "p9.jpg", brand: "Bajaj", rating: 5, reviews: 13, stock_status: "In Stock" }
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
      <h2 className="text-center fw-bold mb-5">Bajaj Products</h2>
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

export default Bajaj;
