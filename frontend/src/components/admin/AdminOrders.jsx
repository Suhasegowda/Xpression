import React, { useState, useEffect } from 'react';
import { Eye, Search, Package, Calendar, CreditCard, ChevronDown } from 'lucide-react';
import api from '../../api/axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders", error);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            fetchOrders();
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const updatePaymentStatus = async (id, paymentMethod, isPaid) => {
        console.log(`Updating payment: ID=${id}, Method=${paymentMethod}, isPaid=${isPaid}`);

        // Optimistic UI Update using functional state to avoid stale closures
        setOrders(prevOrders => prevOrders.map(order =>
            order._id === id
                ? { ...order, isPaid: isPaid, paymentMethod: paymentMethod }
                : order
        ));

        try {
            const { data } = await api.put(`/orders/${id}/payment-status`, { paymentMethod, isPaid });
            console.log("Payment update success:", data);
        } catch (error) {
            console.error("Error updating payment status", error);
            alert(`Failed to update payment: ${error.response?.data?.message || error.message}`);
            // Revert on error by refetching
            fetchOrders();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return { bg: '#def7ec', text: '#03543f', border: '#def7ec' };
            case 'Shipped': return { bg: '#e1effe', text: '#1e429f', border: '#e1effe' };
            case 'Cancelled': return { bg: '#fde8e8', text: '#9b1c1c', border: '#fde8e8' };
            case 'Confirmed': return { bg: '#f3e8ff', text: '#6b21a8', border: '#f3e8ff' };
            default: return { bg: '#fff8f1', text: '#9a3412', border: '#fff8f1' };
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (loading) return <div className="p-4">Loading orders...</div>;

    return (
        <div className="admin-orders-container">
            <div className="page-header">
                <div>
                    <h2 className="title">Manage Orders</h2>
                    <p className="subtitle">Track and update customer order status.</p>
                </div>
                <div className="controls">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search Order ID or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="orders-table-card">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th style={{ width: '35%' }}>Items</th>
                            <th style={{ width: '25%' }}>Customer</th>
                            <th style={{ width: '20%' }}>Payment & Total</th>
                            <th style={{ width: '20%' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order._id}>
                                {/* Items Column */}
                                <td className="items-cell">
                                    <div className="order-id-tag">ID: {order._id}</div>
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

                                {/* Customer Column */}
                                <td>
                                    <div className="customer-info">
                                        <p className="customer-name">{order.shippingAddress?.name || order.user?.name || 'Create User'}</p>
                                        <p className="customer-phone">{order.shippingAddress?.phone}</p>
                                        <p className="customer-address">
                                            {order.shippingAddress?.houseNo}, {order.shippingAddress?.street}, <br />
                                            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                        </p>
                                        <p className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </td>

                                {/* Payment & Total Column */}
                                <td>
                                    <div className="payment-info">
                                        <span className="total-amount">₹{order.totalPrice}</span>
                                        <div className="payment-status-control">
                                            {/* Conditional Payment Dropdown */}
                                            {order.paymentMethod === 'COD' ? (
                                                <select
                                                    className={`payment-select ${order.isPaid ? 'paid' : 'pending'}`}
                                                    value={order.isPaid === true ? 'Done' : 'Pending'}
                                                    onChange={(e) => updatePaymentStatus(order._id, 'COD', e.target.value === 'Done')}
                                                >
                                                    <option value="Pending">COD (Pending)</option>
                                                    <option value="Done">COD (Done)</option>
                                                </select>
                                            ) : (
                                                <select
                                                    className={`payment-select ${order.isPaid ? 'paid' : 'pending'}`}
                                                    value={order.isPaid === true ? 'Done' : 'Pending'}
                                                    onChange={(e) => updatePaymentStatus(order._id, 'UPI', e.target.value === 'Done')}
                                                >
                                                    <option value="Pending">UPI (Pending)</option>
                                                    <option value="Done">UPI (Done)</option>
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Status Column */}
                                <td>
                                    <select
                                        className="status-select"
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        style={{
                                            background: getStatusColor(order.status).bg,
                                            color: getStatusColor(order.status).text,
                                            borderColor: getStatusColor(order.status).border
                                        }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .admin-orders-container {
                    padding: 0;
                }
                
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }
                .subtitle { color: #6b7280; font-size: 0.9rem; }

                .controls { display: flex; gap: 1rem; }
                
                .search-box {
                    display: flex;
                    align-items: center;
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    width: 300px;
                }
                
                .search-box input {
                    border: none;
                    background: transparent;
                    margin-left: 0.5rem;
                    width: 100%;
                    outline: none;
                    font-size: 0.9rem;
                }

                .status-filter {
                    padding: 0.5rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    background: white;
                    color: #374151;
                    cursor: pointer;
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

                .font-mono { font-family: monospace; }
                .order-id-tag { font-weight: 600; color: #374151; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 0.5rem; display: inline-block; }

                .user-info { display: flex; align-items: center; gap: 0.8rem; }
                .avatar-placeholder {
                    width: 36px; height: 36px; background: #eff6ff; color: #3b82f6;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 1rem;
                }
                .user-name { font-weight: 600; color: #111827; font-size: 0.9rem; }
                .order-date { color: #6b7280; font-size: 0.75rem; display: flex; align-items: center; margin-top: 2px; }

                .item-count-badge {
                    display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px;
                    background: #f3f4f6; color: #4b5563; border-radius: 100px; font-size: 0.75rem; font-weight: 500;
                }

                .price-tag { font-weight: 700; color: #111827; }

                .payment-badge {
                    display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px;
                    border-radius: 4px; font-size: 0.75rem; font-weight: 500;
                }
                .payment-badge.paid { background: #ecfdf5; color: #059669; }
                .payment-badge.pending { background: #fff7ed; color: #c2410c; }

                .status-select-wrapper { position: relative; width: 130px; }
                .status-select {
                    appearance: none; width: 100%; padding: 6px 10px; padding-right: 25px;
                    border: 1px solid transparent; border-radius: 100px; font-size: 0.75rem; font-weight: 600;
                    cursor: pointer; text-transform: capitalize;
                }
                .status-select:focus { outline: none; }
                .select-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; }

                .actions-cell { display: flex; justify-content: flex-end; }
                .action-btn.view {
                    background: #f3f4f6; color: #4b5563; padding: 6px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center;
                }
                .action-btn.view:hover { background: #e5e7eb; color: #1f2937; }

                .empty-state { text-align: center; padding: 3rem; color: #6b7280; }
                .text-right { text-align: right; }
            `}</style>
        </div >
    );
};

export default AdminOrders;
