import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data) {
          const mappedProduct = {
            ...data,
            id: data._id, // Map _id to id for context
            image: data.images && data.images.length > 0 ? data.images[0] : '',
          };
          setProduct(mappedProduct);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="container" style={{ padding: '5rem', textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader"></div> <span style={{ marginLeft: '1rem' }}>Loading details...</span>
      <style>{`.loader { border: 4px solid #f3f3f3; border-top: 4px solid var(--color-accent); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; }`}</style>
    </div>
  );

  if (error || !product) return (
    <div className="container" style={{ padding: '5rem', textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }}>Product Not Found</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>{error || "We couldn't find the product you're looking for."}</p>
      <Link to="/shop" style={{ padding: '0.8rem 1.5rem', background: 'var(--color-primary)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
        Back to Shop
      </Link>
    </div>
  );

  const isWishlisted = isInWishlist(product.id);
  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes.filter(s => s.stock > 0).map(s => s.size)
    : [];

  const handleAddToCart = () => {
    if (availableSizes.length === 0) return;
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart({ ...product, selectedSize });
  };

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="details-grid">
          <div className="details-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="details-info">
            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-category">{product.category}</p>

            <div className="pdp-price-row">
              <span className="pdp-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.discountPrice > 0 && <span className="pdp-mrp">MRP ₹{(product.price * 1.4).toFixed(0)}</span>}
              {product.discountPrice > 0 && <span className="pdp-discount">(40% OFF)</span>}
            </div>

            <div className="pdp-rating">
              <span className="pdp-star-box">{product.rating || 4.5} <Star size={12} fill="white" /></span>
              <span className="pdp-ratings-count">1.2k Ratings</span>
            </div>

            <div className="size-selector">
              <div className="size-header">
                <h4>Select Size</h4>
                <button className="size-chart-btn" onClick={() => alert("Size Chart Modal:\nCHEST: S(38), M(40), L(42), XL(44)")}>
                  <Ruler size={16} /> Size Chart
                </button>
              </div>
              <div className="size-options">
                {availableSizes.length > 0 ? (
                  availableSizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="out-of-stock">Out of Stock</p>
                )}
              </div>
            </div>

            <div className="action-buttons-pdp">
              <button
                className="btn-pdp-bag"
                onClick={handleAddToCart}
                disabled={availableSizes.length === 0}
                style={{ opacity: availableSizes.length === 0 ? 0.5 : 1, cursor: availableSizes.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ShoppingBag size={20} /> {availableSizes.length === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
              </button>
              <button
                className={`btn-pdp-wishlist ${isWishlisted ? 'active' : ''}`}
                onClick={() => addToWishlist(product)}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                {isWishlisted ? 'WISHLISTED' : 'WISHLIST'}
              </button>
            </div>

            <div className="pdp-policy">
              <ul>
                <li>100% Original Products</li>
                <li>Pay on delivery might be available</li>
                <li>Easy 14 days returns and exchanges</li>
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h3>Ratings & Reviews</h3>
              {/* Mock reviews or mapped from product.reviews if we populated them */}
              <div className="review-item">
                <div className="reviewer-tag">
                  <span className="star-box-sm">5 <Star size={10} fill="white" /></span>
                  <strong>Amazing Quality!</strong>
                </div>
                <p>The fabric is really soft and the fit is perfect. Loved it!</p>
                <span className="reviewer-name">Rahul K. | a month ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-details-page {
          padding: 3rem 0;
          background: #fff;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 992px) {
          .details-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .details-image img {
          width: 100%;
          border-radius: var(--radius-sm);
        }

        .pdp-title {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .pdp-category {
          color: var(--color-text-muted);
          font-size: 1.1rem;
          margin-bottom: 1rem;
          text-transform: capitalize;
        }

        .pdp-price-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .pdp-price {
          font-weight: 700;
          color: var(--color-text-main);
        }

        .pdp-mrp {
          font-size: 1.1rem;
          text-decoration: line-through;
          color: var(--color-text-muted);
        }

        .pdp-discount {
          font-size: 1.1rem;
          color: var(--color-danger); /* Myntra orange */
          font-weight: 700;
        }

        .pdp-rating {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .pdp-star-box {
          background: var(--color-text-main); /* or Green like Myntra */
          color: white;
          padding: 2px 8px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .size-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .size-chart-btn {
          color: var(--color-accent);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .size-options {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap; 
        }

        .out-of-stock {
            color: red;
            font-weight: 600;
            border: 1px dashed red;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            background: #fff5f5;
        }

        .size-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background: white;
          font-weight: 600;
          transition: all 0.2s;
        }

        .size-btn:hover {
          border-color: var(--color-accent);
        }

        .size-btn.selected {
          border-color: var(--color-accent);
          color: var(--color-accent);
          box-shadow: 0 0 0 1px var(--color-accent);
        }

        .action-buttons-pdp {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .btn-pdp-bag {
          flex: 1;
          background: #ff3e6c;
          color: white;
          padding: 1rem;
          border-radius: 4px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-pdp-wishlist {
          flex: 0.8;
          background: white;
          border: 1px solid #d4d5d9;
          border-radius: 4px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--color-text-main);
        }

        .btn-pdp-wishlist.active {
          background: #535766;
          color: white;
          border-color: #535766;
        }

        .reviews-section {
          margin-top: 3rem;
          border-top: 1px solid #eee;
          padding-top: 2rem;
        }

        .review-item {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f5f5f6;
        }

        .reviewer-tag {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.5rem;
        }

        .star-box-sm {
          background: #14958f; /* Green */
          color: white;
          padding: 1px 5px;
          font-size: 0.7rem;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .reviewer-name {
          font-size: 0.8rem;
          color: #94969f;
          display: block;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
