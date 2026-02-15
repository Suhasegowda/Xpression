import React from 'react';

const ExchangePolicy = () => {
    return (
        <div className="policy-page">
            <div className="container">
                <h1>Exchange Policy</h1>
                <div className="policy-content">
                    <p>At Xpression Mens Wear, we want you to be perfectly happy with your purchase. If you need to exchange an item for a different size or color, we're here to help!</p>

                    <h3>1. Eligibility</h3>
                    <ul>
                        <li>Items must be unused, unwashed, and in original condition with tags attached.</li>
                        <li>Exchange requests must be raised within 14 days of delivery.</li>
                    </ul>

                    <h3>2. Process</h3>
                    <p>To initiate an exchange, please contact our support team or visit the "My Orders" section in your profile (coming soon). Our courier partner will pick up the original item.</p>

                    <h3>3. Timing</h3>
                    <p>Once the pickup is verified, the replacement item will be shipped immediately. The entire process typically takes 5-7 business days.</p>
                </div>
            </div>
            <style>{`
        .policy-page {
          padding: 4rem 0;
          min-height: 60vh;
        }
        h1 { margin-bottom: 2rem; }
        .policy-content h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .policy-content ul { padding-left: 1.5rem; }
        .policy-content li { margin-bottom: 0.5rem; }
      `}</style>
        </div>
    );
};

export default ExchangePolicy;
