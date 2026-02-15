import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, Truck, CreditCard, ChevronRight, Plus, Check, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axios';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Address Form State
    const [addressForm, setAddressForm] = useState({
        name: '',
        phone: '',
        houseNo: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/shop');
        }
        // Load addresses from local storage
        const saved = localStorage.getItem('userAddresses');
        if (saved) {
            setSavedAddresses(JSON.parse(saved));
        }
    }, [cartItems, navigate]);

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        const newAddress = { ...addressForm, id: Date.now() };
        const updatedAddresses = [...savedAddresses, newAddress];
        setSavedAddresses(updatedAddresses);
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        setShowAddressForm(false);
        setSelectedAddress(newAddress);
        // Reset form
        setAddressForm({
            name: '',
            phone: '',
            houseNo: '',
            street: '',
            landmark: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India'
        });
    };

    const handleDeleteAddress = (id) => {
        const updated = savedAddresses.filter(addr => addr.id !== id);
        setSavedAddresses(updated);
        localStorage.setItem('userAddresses', JSON.stringify(updated));
        if (selectedAddress?.id === id) setSelectedAddress(null);
    };

    const handleEditAddress = (addr) => {
        setAddressForm(addr);
        setShowAddressForm(true);
        // We defer removing the old address until save, or handle it as an update.
        // For simplicity, let's treat it as editing the existing entry by ID if we were doing strict updates,
        // but since we generate ID on save, avoiding duplicates requires checking ID.
        // A better approach for this mock: remove the old one now or set an 'editingId' state.
        // Let's remove it from saved list temporarily so 'save' re-adds it (simplified).
        // Or better: Just populate form. The user will click "Save" which adds a new one.
        // To prevent duplicates, we should really update.
        // Let's just remove the one being edited from the list for now to keep it simple.
        const updated = savedAddresses.filter(a => a.id !== addr.id);
        setSavedAddresses(updated);
        localStorage.setItem('userAddresses', JSON.stringify(updated));
        if (selectedAddress?.id === addr.id) setSelectedAddress(null);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setError('Please select a delivery address');
            return;
        }

        setLoading(true);
        setError('');

        // Validate Cart Items
        const invalidItems = cartItems.filter(item => !item.selectedSize);
        if (invalidItems.length > 0) {
            alert("Some items in your cart have missing size information (likely from an old session). Please clear your cart and add items again.");
            setLoading(false);
            return;
        }

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item.id, // Ensure this matches backend expected ID
                    name: item.name,
                    quantity: item.quantity,
                    size: item.selectedSize, // Ensure CartItem has selectedSize
                    price: item.price,
                    image: item.image
                })),
                shippingAddress: {
                    name: selectedAddress.name,
                    phone: selectedAddress.phone,
                    houseNo: selectedAddress.houseNo,
                    street: selectedAddress.street || selectedAddress.houseNo, // Fallback for old addresses
                    landmark: selectedAddress.landmark || '',
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    postalCode: selectedAddress.postalCode,
                    country: selectedAddress.country || 'India' // Ensure country is never undefined
                },
                paymentMethod,
                itemsPrice: cartTotal,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: cartTotal + 20
            };

            console.log("Sending Order Data:", orderData);
            const { data } = await api.post('/orders', orderData);
            console.log("Order Data Response:", data);
            clearCart();
            // Redirect to success page or orders page
            alert('Order Placed Successfully!');
            navigate('/profile');
        } catch (err) {
            console.error("Order Placement Error:", err);
            console.error("Error Response:", err.response?.data);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to place order';
            const errorDetails = err.response?.data || err;
            setError(errorMessage);
            // Optionally store detail in another state if needed, but for now we put it in the UI debug section via alert or just keeping previous setError logic but enhanced.
            // Actually, let's keep it simple for the user but dump logs.
            // Wait, I updated the JSX to show JSON.stringify(error), but error state is usually a string.
            // I should store object.
            // Let's reset logic:
            setError(errorMessage);
            // Better:
            // error state will be string.
            // I'll add a separate debug state or just append to string.
            // Let's make error a structured object or string. For now, string is expected by UI.
            setError(`${errorMessage} (Debug: ${JSON.stringify(err.response?.data || err.message)})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container container">
            <div className="checkout-layout">
                {/* Left Side: Steps */}
                <div className="checkout-steps">
                    {/* Stepper Header */}
                    <div className="stepper">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-icon"><MapPin size={18} /></div>
                            <span>Address</span>
                        </div>
                        <div className="line"></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-icon"><CreditCard size={18} /></div>
                            <span>Payment</span>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="step-content">
                            <div className="section-header">
                                <h3>Select Delivery Address</h3>
                                <button className="add-btn" onClick={() => setShowAddressForm(!showAddressForm)}>
                                    <Plus size={16} /> Add New Address
                                </button>
                            </div>

                            {showAddressForm && (
                                <form onSubmit={handleAddressSubmit} className="address-form">
                                    <div className="form-row">
                                        <input type="text" placeholder="Name" required value={addressForm.name} onChange={e => setAddressForm({ ...addressForm, name: e.target.value })} />
                                        <input type="text" placeholder="Phone 10-digit number" required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} />
                                    </div>
                                    <div className="form-row">
                                        <input type="text" placeholder="Pincode" required value={addressForm.postalCode} onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })} />
                                        <input type="text" placeholder="Locality / Town" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} />
                                    </div>
                                    <div className="form-row">
                                        <input type="text" placeholder="House No / Flat No" required value={addressForm.houseNo} onChange={e => setAddressForm({ ...addressForm, houseNo: e.target.value })} />
                                        <input type="text" placeholder="Street / Colony / Area" required value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" placeholder="Landmark (Optional)" value={addressForm.landmark} onChange={e => setAddressForm({ ...addressForm, landmark: e.target.value })} />
                                    </div>
                                    <div className="form-row">
                                        <input type="text" placeholder="State" required value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} />
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="save-btn">Save Address</button>
                                        <button type="button" className="cancel-btn" onClick={() => setShowAddressForm(false)}>Cancel</button>
                                    </div>
                                </form>
                            )}

                            <div className="saved-addresses">
                                {savedAddresses.map(addr => (
                                    <div key={addr.id} className={`address-card ${selectedAddress?.id === addr.id ? 'selected' : ''}`}>
                                        <div className="address-header">
                                            <div className="radio-group">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={selectedAddress?.id === addr.id}
                                                    onChange={() => setSelectedAddress(addr)}
                                                />
                                                <span className="name">{addr.name}</span>
                                                <span className="type">HOME</span>
                                            </div>
                                            {selectedAddress?.id === addr.id && (
                                                <div className="actions">
                                                    <button className="icon-action" onClick={() => handleEditAddress(addr)}><Edit2 size={14} /></button>
                                                    <button className="icon-action" onClick={() => handleDeleteAddress(addr.id)}><Trash2 size={14} /></button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="address-details">
                                            <p>{addr.houseNo}, {addr.street}</p>
                                            <p>{addr.landmark ? addr.landmark + ', ' : ''}{addr.city} - {addr.postalCode}</p>
                                            <p>{addr.state}</p>
                                            <p className="mobile">Mobile: <strong>{addr.phone}</strong></p>
                                        </div>
                                        {selectedAddress?.id === addr.id && (
                                            <button className="deliver-btn" onClick={() => setStep(2)}>Deliver Here</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content">
                            <h3>Payment Options</h3>
                            <div className="payment-options">
                                <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="option-info">
                                        <span className="title">Cash on Delivery (Cash/UPI)</span>
                                        <span className="desc">Pay when you receive the order</span>
                                    </div>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="UPI"
                                        checked={paymentMethod === 'UPI'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="option-info">
                                        <span className="title">UPI (PhonePe / GPay / Paytm)</span>
                                        <span className="desc">Pay securely via UPI</span>
                                    </div>
                                </label>
                            </div>

                            {/* Short Summary in Payment Step */}
                            <div className="selected-address-summary">
                                <h4>Delivering to:</h4>
                                <p>{selectedAddress.name}, {selectedAddress.postalCode}</p>
                                <button className="change-btn" onClick={() => setStep(1)}>Change</button>
                            </div>

                            <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                            {error && (
                                <div className="error-container">
                                    <p className="error-text">{error}</p>
                                    <details>
                                        <summary>Debug Info</summary>
                                        <pre style={{ textAlign: 'left', fontSize: '10px', marginTop: '5px' }}>
                                            {JSON.stringify(error, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Price Details */}
                <div className="checkout-summary">
                    <div className="summary-card">
                        <h3>Price Details ({cartItems.length} Items)</h3>
                        <div className="price-row">
                            <span>Total MRP</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="price-row">
                            <span>Discount on MRP</span>
                            <span className="discount">-₹0</span>
                        </div>
                        <div className="price-row">
                            <span>Platform Fee</span>
                            <span>₹20</span>
                        </div>
                        <div className="price-row">
                            <span>Shipping Fee</span>
                            <span className="free">FREE</span>
                        </div>
                        <div className="total-row">
                            <span>Total Amount</span>
                            <span>₹{cartTotal + 20}</span>
                        </div>
                    </div>

                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={`${item.id}-${item.selectedSize}`} className="mini-item">
                                <img src={item.image} alt={item.name} />
                                <div className="info">
                                    <p className="name">{item.name}</p>
                                    <p className="meta">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .checkout-container {
                    padding: 2rem 1rem;
                    min-height: 80vh;
                }

                .checkout-layout {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }

                @media (min-width: 992px) {
                    .checkout-layout {
                        grid-template-columns: 1.5fr 1fr;
                        gap: 3rem;
                    }
                }

                /* Stepper */
                .stepper {
                    display: flex;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .step {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #aaa;
                    font-weight: 500;
                }

                .step.active {
                    color: var(--color-primary);
                }
                
                .step-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .step.active .step-icon {
                    background: var(--color-primary);
                    color: white;
                }

                .line {
                    flex: 1;
                    height: 2px;
                    background: #eee;
                    margin: 0 1rem;
                }

                /* Forms */
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .add-btn {
                    color: var(--color-accent);
                    background: none;
                    border: 1px solid var(--color-accent);
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .address-form {
                    background: #fdfdfd;
                    border: 1px solid #eee;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    border-radius: 4px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }

                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .save-btn {
                    background: var(--color-accent);
                    color: white;
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: 4px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .cancel-btn {
                    background: transparent;
                    color: #666;
                    border: none;
                    padding: 0.8rem 1rem;
                    cursor: pointer;
                }

                /* Saved Addresses */
                .saved-addresses {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .address-card {
                    border: 1px solid #eee;
                    padding: 1.5rem;
                    border-radius: 8px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
                }

                .address-card.selected {
                    border-color: var(--color-primary);
                    background: #fffdfd;
                }

                .address-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .radio-group {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }

                .name {
                    font-weight: 700;
                    font-size: 1rem;
                }

                .type {
                    font-size: 0.7rem;
                    background: #eee;
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: #666;
                }

                .address-details p {
                    font-size: 0.9rem;
                    color: #444;
                    margin-bottom: 0.2rem;
                }

                .mobile {
                    margin-top: 0.5rem;
                    color: #333 !important;
                }

                .deliver-btn {
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    width: 100%;
                    padding: 0.8rem;
                    margin-top: 1rem;
                    border-radius: 4px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .icon-action {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    color: #888;
                }
                
                .icon-action:hover {
                    color: var(--color-primary);
                }

                /* Payment */
                .payment-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .payment-option {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .payment-option.selected {
                    border-color: var(--color-primary);
                    background: #f9f9f9;
                }

                .option-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .option-info .title {
                    font-weight: 600;
                }

                .option-info .desc {
                    font-size: 0.85rem;
                    color: #666;
                }

                .selected-address-summary {
                    background: #edf2f7;
                    padding: 1rem;
                    border-radius: 4px;
                    margin: 1.5rem 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .selected-address-summary h4 {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 0.2rem;
                }

                .selected-address-summary p {
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                
                .change-btn {
                    color: var(--color-accent);
                    background: none;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                }

                .place-order-btn {
                    background: var(--color-accent);
                    color: white;
                    border: none;
                    width: 100%;
                    padding: 1rem;
                    font-size: 1.1rem;
                    font-weight: 700;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 1rem;
                }

                .place-order-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                /* Summary Side */
                .summary-card {
                    border: 1px solid #eee;
                    padding: 1.5rem;
                    border-radius: 8px;
                    position: sticky;
                    top: 100px; /* Adjust based on header height */
                }

                .summary-card h3 {
                    font-size: 1rem;
                    color: #555;
                    margin-bottom: 1.5rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .price-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.8rem;
                    font-size: 0.95rem;
                    color: #444;
                }

                .discount {
                    color: #03a685;
                }
                
                .free {
                    color: #03a685;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px dashed #ddd;
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--color-text-main);
                }

                .mini-item {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #eee;
                }

                .mini-item img {
                    width: 50px;
                    height: 65px;
                    object-fit: cover;
                    border-radius: 4px;
                }

                .mini-item .info {
                    flex: 1;
                }
                
                .mini-item .name {
                    font-size: 0.9rem;
                    font-weight: 500;
                    margin-bottom: 0.2rem;
                }

                .mini-item .meta {
                    font-size: 0.8rem;
                    color: #777;
                }
                
                .error-text {
                    color: red;
                    margin-top: 1rem;
                    font-size: 0.9rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default Checkout;
