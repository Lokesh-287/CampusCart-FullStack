import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useContext(AuthContext);

    // If user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if the user's roles include any of the allowed roles
    const isAllowed = user.roles.some(role => allowedRoles.includes(role));

    // If user has the required role, render the component. Otherwise, redirect.
    return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;