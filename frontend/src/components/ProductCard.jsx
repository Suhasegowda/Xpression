import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="image-container">
        <img src={product.image} alt={product.name} loading="lazy" />

        {/* Wishlist Button Overlay */}
        <button
          className="wishlist-btn"
          aria-label="Add to Wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToWishlist(product);
          }}
          style={{
            opacity: isWishlisted ? 1 : undefined, // Stay visible if active
            transform: isWishlisted ? 'translateY(0)' : undefined,
            color: isWishlisted ? '#e74c3c' : undefined
          }}
        >
          <Heart size={20} fill={isWishlisted ? "#e74c3c" : "none"} />
        </button>

        {/* New Tag */}
        {product.isNew && <span className="new-tag">New</span>}
      </Link>

      <div className="product-info">
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < Math.floor(product.rating) ? "#c9a55c" : "none"}
              color={i < Math.floor(product.rating) ? "#c9a55c" : "#ddd"}
            />
          ))}
          <span className="rating-value">({product.rating})</span>
        </div>

        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>

        <div className="product-footer">
          <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            <ShoppingBag size={16} />
            Add
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        .image-container {
          display: block; /* Ensure Link behaves like a block */
          position: relative;
          width: 100%;
          padding-top: 125%; /* 4:5 Aspect Ratio */
          overflow: hidden;
          background-color: #f0f0f0;
        }

        .image-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .image-container img {
          transform: scale(1.05);
        }

        .wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: white;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          color: var(--color-text-main);
          z-index: 2;
        }
        
        .wishlist-btn:hover {
          color: var(--color-danger);
          background: white;
        }

        /* Show wishlist button on hover */
        .product-card:hover .wishlist-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .new-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: var(--color-primary);
          color: white;
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          text-transform: uppercase;
        }

        .product-info {
          padding: 1rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-bottom: 0.5rem;
        }

        .rating-value {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-left: 4px;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-category {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          text-transform: capitalize;
          margin-bottom: 1rem;
        }

        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .price {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--color-primary);
        }

        .add-to-cart-btn {
          background-color: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .add-to-cart-btn:hover {
          background-color: var(--color-accent);
        }
      `}</style>
    </div >
  );
};

export default ProductCard;
