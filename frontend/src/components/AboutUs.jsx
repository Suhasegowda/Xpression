import React from 'react';

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title" style={{ textAlign: 'left' }}>About <span className="text-accent">Xpression</span></h2>
            <p className="about-description">
              Welcome to <strong>Xpression Mens Wear</strong>, where style meets sophistication.
              Established in 2026, we have been dedicated to redefining men's fashion with a curated collection
              of premium clothing.
            </p>
            <p className="about-description">
              Our mission is to empower men to express their individuality through high-quality attire.
              From sharp formal wear to relaxed casuals, every piece in our collection is chosen for its
              craftsmanship, comfort, and timeless appeal.
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">5k+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">Premium Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.7</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img
              src="https://lh3.googleusercontent.com/proxy/vXsGIGMy_Jbe8JPw9yz5hiqRytSRP7AgeRq7l99KWb9T1Jv2MbKvjNiEyEdPmVLJjDvm9CSOmZvd71JWbjAFPZgA7xPPKaDPLbsszGZihwN0GZeZJg50eExvPmTgtFPNn4pkafpuRSFUyImIUOEyU2O__r4Yx1c8AZdbXw=s1360-w1360-h1020-rw"
              alt="Tailor working on fabric"
              className="rounded-image"
            />
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          padding: 6rem 0;
          background-color: var(--color-bg-light);
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (min-width: 992px) {
          .about-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        .text-accent {
          color: var(--color-accent);
        }

        .about-description {
          font-size: 1.1rem;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .rounded-image {
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid white;
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
