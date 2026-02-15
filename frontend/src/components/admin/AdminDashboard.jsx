import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users as UsersIcon, Package } from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch stats from backend
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stat-info">
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
            <div className="stat-icon" style={{ color: color, background: `${color}20` }}>
                {icon}
            </div>
        </div>
    );

    if (loading) return <div className="p-4">Loading dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <h1 className="page-title">Dashboard Overview</h1>

            <div className="stats-grid">
                <StatCard
                    title="Total Sales"
                    value={`₹${stats.totalSales?.toLocaleString('en-IN') || 0}`}
                    icon={<DollarSign size={24} />}
                    color="#10b981"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders || 0}
                    icon={<ShoppingBag size={24} />}
                    color="#3b82f6"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers || 0}
                    icon={<UsersIcon size={24} />}
                    color="#f59e0b"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts || 0}
                    icon={<Package size={24} />}
                    color="#6366f1"
                />
            </div>

            <div className="dashboard-charts">
                {/* Placeholder for charts or recent orders */}
                <div className="recent-activity">
                    <h2>System Status</h2>
                    <p>Backend Connection: <span style={{ color: '#10b981', fontWeight: 'bold' }}>Active</span></p>
                    <p>Database: <span style={{ color: '#10b981', fontWeight: 'bold' }}>Connected</span></p>
                </div>
            </div>

            <style>{`
                .page-title {
                    font-size: 1.8rem;
                    margin-bottom: 2rem;
                    color: #1f2937;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .stat-info h3 {
                    font-size: 0.9rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                }

                .stat-info p {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111;
                }

                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .recent-activity {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
