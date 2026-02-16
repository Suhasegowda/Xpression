import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    if (!userInfo) {
        console.warn("ProtectedRoute: No user info found in localStorage. Redirecting to home.");
        return <Navigate to="/" replace />;
    }

    console.log("ProtectedRoute check:", { role: userInfo.role, adminOnly });

    if (adminOnly && userInfo.role !== 'admin') {
        console.warn(`ProtectedRoute: User role is '${userInfo.role}', but required 'admin'. Redirecting to home.`);
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
