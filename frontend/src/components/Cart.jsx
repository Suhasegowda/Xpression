import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Tag, Gift, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems = [], removeFromCart, updateQuantity } = useCart();

  // Safety check: ensure cartItems is an array
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const totalMRP = safeCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = totalMRP * 0.1; // flat 10% mock discount
  const platformFee = 2.00;
  const shippingFee = totalMRP > 50 ? 0 : 5.00;
  const totalAmount = totalMRP - discount + platformFee + shippingFee;

  if (safeCartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <img
          src="https://constant.myntassets.com/checkout/assets/img/empty-bag.png"
          alt="Empty Cart"
          className="empty-cart-img"
        />
        <h2>Hey, it feels so light!</h2>
        <p>There is nothing in your bag. Let's add some items.</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          ADD ITEMS FROM WISHLIST
        </Link>
        <style>{`
          .empty-cart-container {
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: #fff;
          }
          .empty-cart-img {
            width: 150px;
            margin-bottom: 2rem;
            opacity: 0.8;
          }
          .empty-cart-container h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--color-primary);
          }
          .empty-cart-container p {
            color: var(--color-text-muted);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container cart-layout">
        <div className="cart-left">
          <div className="cart-header-count">
            <h3>{safeCartItems.length} Items Selected</h3>
          </div>

          <div className="cart-items">
            {safeCartItems.map(item => {
              const sizeData = item.sizes?.find(s => s.size === item.selectedSize);
              const maxStock = sizeData ? sizeData.stock : 10;

              const handleIncrement = () => {
                if (item.quantity < maxStock) {
                  updateQuantity(item.id, item.selectedSize, 1);
                } else {
                  alert(`Sorry, only ${maxStock} items available in this size.`);
                }
              };

              return (
                <div key={`${item.id}-${item.selectedSize}`} className="cart-item">
                  <Link to={`/product/${item.id}`} className="item-image-wrapper">
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="item-details">
                    <div className="item-brand">XPRESSION</div>
                    <h4 className="item-name">{item.name}</h4>

                    <div className="item-meta">
                      {item.selectedSize && <span className="meta-tag">Size: {item.selectedSize}</span>}
                      {sizeData && sizeData.stock < 5 && <span className="meta-tag" style={{ color: 'red', marginLeft: '10px' }}>Only {sizeData.stock} left!</span>}
                    </div>

                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={handleIncrement} disabled={item.quantity >= maxStock} style={{ opacity: item.quantity >= maxStock ? 0.5 : 1 }}>+</button>
                    </div>

                    <div className="item-price-row">
                      <span className="current-price">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="cart-right">
          <div className="price-details-card">
            <div className="price-breakdown">
              <span className="section-label">PRICE DETAILS ({safeCartItems.length} Items)</span>

              <div className="price-row">
                <span>Total MRP</span>
                <span>₹{totalMRP.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="price-row">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? <span className="text-success">FREE</span> : `₹${shippingFee}`}</span>
              </div>

              <div className="total-row">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link to="/checkout" className="place-order-btn-link place-order-btn">
              PLACE ORDER
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page {
          background-color: #f5f5f6; /* Very light grey like Myntra */
          min-height: 100vh;
          padding: 2rem 0;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 992px) {
          .cart-layout {
            grid-template-columns: 1.8fr 1.2fr;
            max-width: 1000px; /* Constrain width for better reading like Myntra */
          }
        }

        .cart-section {
          background: white;
          border-radius: var(--radius-sm);
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #eaeaec;
        }

        .offers-box ul {
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .offer-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--color-text-main);
        }

        .cart-header-count {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .cart-header-count h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .cart-item {
          display: flex;
          background: white;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #eaeaec;
          border-radius: var(--radius-sm);
          position: relative;
        }

        .item-image-wrapper {
          width: 110px;
          height: 140px;
          flex-shrink: 0;
          margin-right: 1rem;
        }

        .item-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .item-details {
          flex: 1;
        }

        .item-brand {
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .item-name {
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }

        .item-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
        }

        .meta-tag {
          background: #f5f5f6;
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 0.75rem;
          color: var(--color-text-main);
          font-weight: 600;
        }

        .quantity-controls {
           display: flex;
           align-items: center;
           gap: 1rem;
           margin-bottom: 0.8rem;
        }

        .quantity-controls button {
           width: 28px;
           height: 28px;
           border-radius: 50%;
           border: 1px solid #ccc;
           background: white;
           font-weight: 600;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
        }

        .quantity-controls button:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
        }

        .item-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .current-price {
          font-weight: 700;
          font-size: 1rem;
        }

        .original-price {
          text-decoration: line-through;
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }

        .discount-off {
          color: var(--color-danger); /* Typically orange/red */
          font-size: 0.85rem;
          font-weight: 600;
        }

        .return-policy {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .remove-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: var(--color-text-muted);
        }

        .remove-btn:hover {
          color: var(--color-danger);
        }

        /* Right Side */
        .cart-right {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-muted);
          margin-bottom: 0.8rem;
          display: block;
        }

        .price-details-card {
          /* Sticky logic usually goes here but for simple layout it's fine */
        }

        .coupons-section, .gifting-section, .price-breakdown {
          padding: 1rem;
          background: white;
          border: 1px solid #eaeaec;
          border-radius: var(--radius-sm);
          margin-bottom: 1rem;
        }

        .apply-coupon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .apply-btn {
          margin-left: auto;
          border: 1px solid var(--color-accent);
          color: var(--color-accent);
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .gift-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          background: #fff1f2; /* Light pinkish */
          padding: 0.8rem;
          border-radius: var(--radius-sm);
        }

        .gift-text {
          flex: 1;
          font-size: 0.8rem;
        }
        
        .add-gift-btn {
          font-size: 0.75rem;
          color: #ff3f6c;
          font-weight: 700;
          white-space: nowrap;
        }
        
        .price-breakdown .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid #eaeaec;
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-text-main);
        }

        .text-success { color: var(--color-success); }
        .text-action { color: #ff3f6c; cursor: pointer; }

        .place-order-btn {
          width: 100%;
          background-color: #ff3f6c; /* Myntra pink/red */
          color: white;
          font-weight: 700;
          padding: 1rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 1rem;
        }


        .place-order-btn:hover {
          background-color: #e62e5c;
        }

        .place-order-btn-link {
            text-decoration: none;
            display: block;
            text-align: center;
        }

      `}</style>
    </div>
  );
};

export default Cart;
