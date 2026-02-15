import React from 'react';

const FAQ = () => {
    return (
        <div className="faq-page">
            <div className="container">
                <h1>Frequently Asked Questions</h1>
                <div className="faq-list">
                    <div className="faq-item">
                        <h3>How do I check my size?</h3>
                        <p>You can refer to our Size Chart available on every product page to find your perfect fit.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Do you ship internationally?</h3>
                        <p>Currently, we only ship within India. We plan to expand globally soon!</p>
                    </div>
                    <div className="faq-item">
                        <h3>How can I track my order?</h3>
                        <p>Once shipped, you will receive an SMS and Email with the tracking link.</p>
                    </div>
                    <div className="faq-item">
                        <h3>What payment methods do you accept?</h3>
                        <p>We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery.</p>
                    </div>
                    <div className="faq-item">
                        <h3>What is your return policy?</h3>
                        <p>We offer a hassle-free 14-day return policy for all unused items with original tags.</p>
                    </div>
                </div>
            </div>
            <style>{`
        .faq-page {
          padding: 4rem 0;
          min-height: 60vh;
        }
        h1 { margin-bottom: 2rem; }
        .faq-item {
          background: #f9f9f9;
          padding: 1.5rem;
          margin-bottom: 1rem;
          border-radius: 8px;
        }
        .faq-item h3 { margin-bottom: 0.5rem; color: var(--color-primary); }
        .faq-item p { color: #666; }
      `}</style>
        </div>
    );
};

export default FAQ;
