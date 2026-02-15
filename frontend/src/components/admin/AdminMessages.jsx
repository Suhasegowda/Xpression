import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Mail, CheckCircle, Clock } from 'lucide-react';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/messages');
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/messages/${id}/resolve`);
            fetchMessages(); // Refresh list
        } catch (error) {
            console.error("Error resolving message:", error);
        }
    };

    if (loading) return <div>Loading messages...</div>;

    return (
        <div className="admin-content">
            <div className="page-header">
                <h2>User Messages & Complaints</h2>
            </div>

            <div className="messages-list">
                {messages.length === 0 ? (
                    <p>No messages found.</p>
                ) : (
                    messages.map(msg => (
                        <div key={msg._id} className={`message-card ${msg.status === 'Resolved' ? 'resolved' : 'new'}`}>
                            <div className="message-header">
                                <div className="user-info">
                                    <h4>{msg.name}</h4>
                                    <span className="email">{msg.email}</span>
                                </div>
                                <div className="meta">
                                    <span className={`status-badge ${msg.status.toLowerCase()}`}>
                                        {msg.status === 'Resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {msg.status}
                                    </span>
                                    <span className="date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="message-body">
                                <p>{msg.message}</p>
                            </div>
                            {msg.status !== 'Resolved' && (
                                <button className="resolve-btn" onClick={() => handleResolve(msg._id)}>
                                    Mark as Resolved
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .messages-list {
                    display: grid;
                    gap: 1rem;
                }

                .message-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid #eee;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .message-card.new {
                    border-left: 4px solid var(--color-accent);
                }

                .message-card.resolved {
                    border-left: 4px solid #2ecc71;
                    opacity: 0.8;
                }

                .message-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .user-info h4 {
                    margin: 0;
                    font-size: 1.1rem;
                }

                .email {
                    font-size: 0.9rem;
                    color: #666;
                }

                .meta {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.5rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .status-badge.new {
                    background: #fff3e0;
                    color: #e67e22;
                }

                .status-badge.resolved {
                    background: #e8f8f5;
                    color: #2ecc71;
                }

                .date {
                    font-size: 0.8rem;
                    color: #999;
                }

                .message-body {
                    background: #f9f9f9;
                    padding: 1rem;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                    color: #333;
                }

                .resolve-btn {
                    background: none;
                    border: 1px solid #2ecc71;
                    color: #2ecc71;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .resolve-btn:hover {
                    background: #2ecc71;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default AdminMessages;
