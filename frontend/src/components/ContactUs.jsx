import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import api from '../api/axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    complaint: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages', {
        name: formData.name,
        email: formData.email,
        message: formData.complaint
      });
      alert(`Message sent by ${formData.name}`);
      setFormData({ name: '', email: '', complaint: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to send message');
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <h2 className="section-title">Contact <span className="text-accent">Us</span></h2>

        <div className="contact-grid">
          {/* Contact Info & Map */}
          <div className="contact-info-wrapper">
            <div className="info-cards">
              <div className="info-card">
                <MapPin className="info-icon" size={32} />
                <h3>Visit Us</h3>
                <p>S No.156/B, Near PES College, 10th Main,</p>
                <p>Hanumanthnagar, 50 Feet Main Rd,</p>
                <p>Banashankari, Bengaluru, Karnataka 560050</p>
              </div>
              <div className="info-card">
                <Phone className="info-icon" size={32} />
                <h3>Call Us</h3>
                <p>+91 9620686688</p>
                <p>Owner: Mr. Sachin</p>
              </div>
              <div className="info-card">
                <Mail className="info-icon" size={32} />
                <h3>Email Us</h3>
                <p>Xpressionsachi@gmail.com</p>
              </div>
            </div>

            <div className="map-container">
              {/* Google Maps Embed */}
              <iframe
                src="https://maps.google.com/maps?q=156%2FB+50+Feet+Main+Rd%2C+Hanumanthnagar%2C+Banashankari%2C+Bengaluru%2C+Karnataka+560050&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Shop Location"
              ></iframe>
            </div>
          </div>

          {/* Complaints Form */}
          <div className="form-wrapper">
            <h3>Send a Complaint / Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div className="form-group">
                <label>Gmail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your.email@gmail.com"
                  pattern="[a-z0-9._%+-]+@gmail\.com$"
                  title="Please enter a valid Gmail address"
                />
              </div>
              <div className="form-group">
                <label>Complaint Details</label>
                <textarea
                  value={formData.complaint}
                  onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                  required
                  placeholder="Describe your issue or feedback..."
                  rows="5"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Send Message <Send size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          padding: 6rem 0;
          background-color: var(--color-bg-white);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
        }

        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .info-card {
          padding: 2rem;
          background: var(--color-bg-light);
          border-radius: var(--radius-md);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .info-icon {
          color: var(--color-accent);
          margin-bottom: 1rem;
        }

        .info-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .info-card p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        .map-container {
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-premium);
        }

        .form-wrapper {
          background: white;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }

        .form-wrapper h3 {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-accent);
        }
      `}</style>
    </section>
  );
};

export default ContactUs;
