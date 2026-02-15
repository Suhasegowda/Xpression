import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    if (!userInfo) {
        console.log("ProtectedRoute: No user info found, redirecting to home");
        return <Navigate to="/" replace />; // Redirect to home/login if not logged in
    }

    if (adminOnly && userInfo.role !== 'admin') {
        console.log(`ProtectedRoute: User role is ${userInfo.role}, required admin. Redirecting.`);
        return <Navigate to="/" replace />; // Redirect to home if not admin
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
