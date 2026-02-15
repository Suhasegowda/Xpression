import React, { useState } from 'react';
import { Package, ShoppingBag } from 'lucide-react';
import api from '../api/axios';

const TrackOrder = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchMyOrders = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const { data } = await api.get('/orders/myorders');
                    setMyOrders(data);
                } catch (err) {
                    console.error("Failed to fetch my orders", err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return { bg: '#def7ec', text: '#03543f', border: '#def7ec' };
            case 'Shipped': return { bg: '#e1effe', text: '#1e429f', border: '#e1effe' };
            case 'Cancelled': return { bg: '#fde8e8', text: '#9b1c1c', border: '#fde8e8' };
            case 'Confirmed': return { bg: '#f3e8ff', text: '#6b21a8', border: '#f3e8ff' };
            default: return { bg: '#fff8f1', text: '#9a3412', border: '#fff8f1' };
        }
    };

    if (loading) return <div className="p-4 text-center">Loading your orders...</div>;

    if (myOrders.length === 0) {
        return (
            <div className="track-order-page">
                <div className="track-container empty">
                    <Package size={48} color="#ccc" />
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet.</p>
                </div>
                <style>{`
                    .track-order-page { padding: 4rem 1rem; display: flex; justify-content: center; background: #f9fafb; min-height: 60vh; }
                    .track-container { background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; max-width: 500px; width: 100%; }
                    .empty h3 { margin-top: 1rem; color: #374151; }
                    .empty p { color: #6b7280; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="track-order-page">
            <div className="track-container">
                <h2 className="title">My Orders</h2>
                <div className="orders-table-card">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50%' }}>Order Details</th>
                                <th style={{ width: '25%' }}>Total Price</th>
                                <th style={{ width: '25%' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myOrders.map(order => (
                                <tr key={order._id}>
                                    {/* Items Column */}
                                    <td className="items-cell">
                                        <div className="order-id-tag">ID: {order._id}</div>
                                        <div className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
                                        <div className="items-list">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="order-item-row">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="item-img" style={{ width: '30px', height: '40px' }} />
                                                    ) : (
                                                        <div className="item-img-placeholder" style={{ width: '30px', height: '40px' }}>
                                                            <ShoppingBag size={14} color="#888" />
                                                        </div>
                                                    )}
                                                    <div className="item-details">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-meta">Size: <strong>{item.size}</strong> | Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Price Column */}
                                    <td>
                                        <span className="total-amount">₹{order.totalPrice}</span>
                                        <div className="payment-method">{order.paymentMethod}</div>
                                    </td>

                                    {/* Status Column */}
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                background: getStatusColor(order.status).bg,
                                                color: getStatusColor(order.status).text,
                                                border: `1px solid ${getStatusColor(order.status).border}`
                                            }}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .track-order-page {
                    padding: 2rem 1rem;
                    min-height: 80vh;
                    background: #f9fafb;
                    display: flex;
                    justify-content: center;
                }

                .track-container {
                    width: 100%;
                    max-width: 900px;
                }

                .title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 1.5rem;
                }

                .orders-table-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    overflow: hidden;
                }

                .orders-table { width: 100%; border-collapse: separate; border-spacing: 0 1rem; } 
                
                .orders-table tbody tr {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    background: white;
                }

                .orders-table th {
                    text-align: left; padding: 1rem 1.5rem; background: #f9fafb; color: #6b7280;
                    font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
                }

                .orders-table td { 
                    padding: 1.5rem; 
                    vertical-align: top;
                    background: white;
                    border-top: 1px solid #f3f4f6;
                    border-bottom: 1px solid #f3f4f6;
                }

                .orders-table td:first-child { border-left: 1px solid #f3f4f6; border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
                .orders-table td:last-child { border-right: 1px solid #f3f4f6; border-top-right-radius: 8px; border-bottom-right-radius: 8px; }

                .order-id-tag { font-weight: 600; color: #374151; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 0.5rem; display: inline-block; font-family: monospace; }
                .order-date { color: #6b7280; font-size: 0.8rem; margin-bottom: 1rem; }

                .items-list { display: flex; flex-direction: column; gap: 0.8rem; }
                .order-item-row { display: flex; gap: 1rem; align-items: center; }
                
                .item-img { object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
                .item-img-placeholder { background: #eee; border-radius: 4px; display: flex; align-items: center; justify-content: center; }

                .item-details { display: flex; flex-direction: column; }
                .item-name { font-weight: 500; font-size: 0.9rem; color: #111827; }
                .item-meta { font-size: 0.8rem; color: #6b7280; }

                .total-amount { font-weight: 700; font-size: 1rem; color: #111827; display: block; }
                .payment-method { font-size: 0.8rem; color: #6b7280; margin-top: 4px; }

                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }
            `}</style>
        </div>
    );
};

export default TrackOrder;
