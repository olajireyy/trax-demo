import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useUser();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user.isAuthenticated) {
        // Redirect to the login page with the current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
