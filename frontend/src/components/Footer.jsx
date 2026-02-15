import React from 'react';
import { Facebook, Twitter, Instagram, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-links-column">
            <h3>Customer Service</h3>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/track-order">Track Order</Link>
            <Link to="/exchange-policy">Exchange Policy</Link>
            <Link to="#" onClick={(e) => { e.preventDefault(); alert("Size Chart Modal Placeholder") }}>Size Chart</Link>
          </div>

          <div className="footer-brand-column">
            <Link to="/" className="logo footer-logo">
              Xpression<span className="logo-accent">.</span>
            </Link>
            <p>Redefining Men's Fashion</p>

            <div className="social-links">
              <a href="#" aria-label="WhatsApp"><Phone size={20} /></a> {/* Using Phone as WhatsApp placeholder icon */}
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Xpression Mens Wear. All Rights Reserved.</p>
          <p style={{ fontSize: '0.7em', opacity: 0.5, marginTop: '5px' }}>
            Debug: API connected to {import.meta.env.VITE_API_BASE_URL || 'Hardcoded Fallback'}
          </p>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: var(--color-primary);
          color: white;
          padding: 4rem 0 1rem;
          margin-top: auto;
        }

        .footer-container {
          display: flex;
          flex-direction: column;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .footer-links-column {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-links-column h3 {
          color: var(--color-accent);
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .footer-links-column a {
          color: #ccc;
          font-size: 0.95rem;
          transition: color 0.3s;
        }

        .footer-links-column a:hover {
          color: white;
        }

        .footer-brand-column {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
        }

        .footer-logo {
          color: white;
          font-size: 2rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.3s;
          color: white;
        }

        .social-links a:hover {
          background: var(--color-accent);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1.5rem;
          text-align: center;
          color: #888;
          font-size: 0.85rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
