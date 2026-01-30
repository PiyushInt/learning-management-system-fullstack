import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, role }) => {
    const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && userRole !== role) {
        // If user's role doesn't match the required role for this route
        return <Navigate to="/" replace />; // Or unauthorized page
    }

    return children;
};

export default PrivateRoute;
