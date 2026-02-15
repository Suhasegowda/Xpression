import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle, Trash2, Search, User, Mail, Shield } from 'lucide-react';
import api from '../../api/axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/auth/users');
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users", error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const toggleBlock = async (id) => {
        try {
            await api.put(`/auth/${id}/block`);
            setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/auth/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="loader"></div>
            <style>{`.loader { border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="admin-users-container">
            <div className="page-header">
                <div>
                    <h2 className="title">User Management</h2>
                    <p className="subtitle">Manage system users, roles, and access.</p>
                </div>
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="users-table-card">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-info-cell">
                                            <div className="avatar-placeholder">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="user-name">{user.name}</div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="join-date">
                                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                className={`action-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                                                onClick={() => toggleBlock(user._id)}
                                                title={user.isBlocked ? "Unblock User" : "Block User"}
                                            >
                                                {user.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(user._id)}
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    No users found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                .admin-users-container {
                    padding: 1rem;
                }
                
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .title {
                    font-size: 1.5rem;
                    color: #111827;
                    font-weight: 700;
                    margin-bottom: 0.2rem;
                }

                .subtitle {
                    color: #6b7280;
                    font-size: 0.9rem;
                }

                .search-box {
                    position: relative;
                    width: 300px;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                }

                .search-box input {
                    width: 100%;
                    padding: 0.6rem 1rem 0.6rem 2.5rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }

                .search-box input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .users-table-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                    overflow: hidden;
                }

                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .users-table th {
                    text-align: left;
                    padding: 1rem 1.5rem;
                    background: #f9fafb;
                    color: #6b7280;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .users-table td {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #e5e7eb;
                    vertical-align: middle;
                }

                .user-info-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .avatar-placeholder {
                    width: 40px;
                    height: 40px;
                    background: #eff6ff;
                    color: #3b82f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.1rem;
                }

                .user-name {
                    font-weight: 600;
                    color: #111827;
                    font-size: 0.95rem;
                }

                .user-email {
                    color: #6b7280;
                    font-size: 0.85rem;
                }

                .role-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .role-badge.admin {
                    background: #eef2ff;
                    color: #4f46e5;
                }

                .role-badge.user {
                    background: #f3f4f6;
                    color: #374151;
                }

                .status-badge {
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .status-badge.active {
                    background: #ecfdf5;
                    color: #059669;
                }

                .status-badge.blocked {
                    background: #fef2f2;
                    color: #dc2626;
                }

                .join-date {
                    color: #6b7280;
                    font-size: 0.9rem;
                }

                .actions-cell {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.5rem;
                }

                .action-btn {
                    padding: 6px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-btn.block {
                    background: #fff1f2;
                    color: #e11d48;
                }
                .action-btn.block:hover { background: #ffe4e6; }

                .action-btn.unblock {
                    background: #ecfdf5;
                    color: #059669;
                }
                .action-btn.unblock:hover { background: #d1fae5; }

                .action-btn.delete {
                    background: #f3f4f6;
                    color: #4b5563;
                }
                .action-btn.delete:hover {
                    background: #e5e7eb;
                    color: #1f2937;
                }
                
                .text-right { text-align: right; }

                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: #6b7280;
                }
            `}</style>
        </div>
    );
};

export default AdminUsers;
