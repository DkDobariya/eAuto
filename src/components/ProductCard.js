import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="card shadow-sm m-2" style={{ width: '18rem' }}>
      <img src={product.image} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.brand} - {product.name}</h5>
        <p className="card-text">₹{product.price} <small className="text-muted">({product.discount}% OFF)</small></p>
        <button className="btn btn-primary w-100" onClick={() => onAddToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
    