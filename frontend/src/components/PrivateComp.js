import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
    const auth = JSON.parse(localStorage.getItem('token')) || {};

    if (!auth.token) {
        return <Navigate to="/login" />;
    }

    if (!role.includes(auth.role)) {
        if (auth.role === 'admin') {
            return <Navigate to="/" />;
        } else if (auth.role === 'candidate') {
            return <Navigate to="/candidate_profile" />;
        } else {
            return <Navigate to="/login" />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
