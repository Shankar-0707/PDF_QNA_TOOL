// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return <div>Checking authentication...</div>; 
    }

    // If a user is present in the context (meaning they have a valid token),
    // render the child routes (<Outlet />). Otherwise, redirect to the login page.
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;