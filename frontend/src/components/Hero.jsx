import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-subtitle animate-fade-in">New Collection 2026</span>
                    <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Redefining <br />
                        <span className="text-accent">Gentleman's</span> Style
                    </h1>
                    <p className="hero-description animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Discover the finest fabrics and cuts tailored for the modern man.
                        Elevate your wardrobe with Xpression.
                    </p>
                    <Link to="/shop" className="btn btn-primary animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        Shop Now <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>

                <div className="hero-image-wrapper animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="image-card">
                        <img
                            src="https://images.unsplash.com/photo-1617137968427-85924c809a29?q=80&w=1974&auto=format&fit=crop"
                            alt="Male Model in Suit"
                            className="hero-image"
                        />
                    </div>
                    {/* Decorative elements */}
                    <div className="circle-decoration"></div>
                </div>
            </div>

            <style>{`
        .hero {
          padding: 4rem 0;
          min-height: 85vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          overflow: hidden;
          position: relative;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (min-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .hero-content {
          z-index: 2;
        }

        .hero-subtitle {
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
          display: block;
          font-weight: 600;
        }

        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 4.5rem;
          }
        }

        .text-accent {
          color: var(--color-accent);
          font-style: italic;
        }

        .hero-description {
          font-size: 1.1rem;
          color: var(--color-text-muted);
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .hero-image-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .image-card {
          position: relative;
          width: 100%;
          max-width: 450px;
          height: 600px;
          border-radius: 200px 200px 20px 20px; /* Arch shape */
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          transition: transform 0.5s ease;
        }
        
        .image-card:hover {
          transform: translateY(-10px);
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: var(--glass-bg);
          backdrop-filter: blur(8px);
          padding: 1rem 2rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          white-space: nowrap;
        }

        .collection-tag {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tag-line {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-muted);
        }

        .tag-name {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--color-primary);
        }

        .circle-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 2px solid var(--color-accent);
          z-index: -1;
          opacity: 0.5;
        }
      `}</style>
        </section>
    );
};

export default Hero;
