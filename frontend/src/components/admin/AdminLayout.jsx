import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X, Home, Mail } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    const navItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/messages', icon: <Mail size={20} />, label: 'Messages' },
    ];

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2 className="brand">Xpression<span style={{ color: 'var(--color-accent)' }}>.</span></h2>
                    <span className="badge-admin">Admin</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <div className="nav-divider"></div>

                    <Link to="/" className="nav-item">
                        <Home size={20} />
                        <span>Go to Shop</span>
                    </Link>

                    <button onClick={handleLogout} className="nav-item logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="header-user">
                        <span>Admin Panel</span>
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>

            <style>{`
                .admin-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: #f3f4f6;
                }

                .admin-sidebar {
                    width: 260px;
                    background: #1a1a1a;
                    color: white;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                    z-index: 100;
                }

                .admin-sidebar.closed {
                    width: 0;
                    overflow: hidden;
                }

                .sidebar-header {
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-bottom: 1px solid #333;
                }

                .brand {
                    font-size: 1.5rem;
                    color: white;
                }

                .badge-admin {
                    background: var(--color-accent);
                    color: black;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.7rem;
                    font-weight: bold;
                }

                .sidebar-nav {
                    padding: 1.5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.8rem 1rem;
                    color: #a3a3a3;
                    border-radius: 6px;
                    transition: all 0.2s;
                    font-weight: 500;
                }

                .nav-item:hover, .nav-item.active {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }

                .nav-divider {
                    height: 1px;
                    background: #333;
                    margin: 1rem 0;
                }

                .logout-btn {
                    color: #ef4444;
                    width: 100%;
                    text-align: left;
                }

                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .admin-main {
                    flex: 1;
                    margin-left: ${isSidebarOpen ? '260px' : '0'};
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .admin-header {
                    background: white;
                    padding: 1rem 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    position: sticky;
                    top: 0;
                    z-index: 90;
                }

                .admin-content {
                    padding: 2rem;
                    flex: 1;
                }

                @media (max-width: 768px) {
                    .admin-sidebar {
                        width: 100%;
                        transform: translateX(-100%);
                    }
                    .admin-sidebar.open {
                        transform: translateX(0);
                    }
                    .admin-main {
                        margin-left: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
