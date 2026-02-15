import React from 'react';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems = [] } = useCart();

  // Safety check
  const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : [];

  return (
    <section className="wishlist-section">
      <div className="container">
        <h2 className="section-title">My <span className="text-accent">Wishlist</span></h2>

        {wishlistItems.length > 0 ? (
          <div className="products-grid">
            {wishlistItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Your wishlist is empty</h3>
            <p>Save items that you like in your wishlist. Review them anytime and easily move them to the bag.</p>
            <Link to="/shop" className="btn btn-outline" style={{ marginTop: '1rem' }}>
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .wishlist-section {
          padding: 4rem 0;
          min-height: 70vh;
        }

        .text-accent {
          color: var(--color-accent);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem;
          background: var(--color-bg-white);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: var(--color-text-muted);
          max-width: 400px;
          margin: 0 auto;
        }
      `}</style>
    </section>
  );
};

export default Wishlist;
