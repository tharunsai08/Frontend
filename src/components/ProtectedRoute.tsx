import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from './Loading';
import { safeJSONParse } from './Navbar';

const ProtectedRoute: React.FC<{ children: React.ReactNode, superuserOnly?: boolean }> = ({ children, superuserOnly = false }) => {
    const { isAuthenticated, token, user } = useAuth();
    const [loading, setLoading] = useState(true);

    const isSuperuser = safeJSONParse(localStorage.getItem('isSuperuser'), false);


    useEffect(() => {
        if (token && user) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [token, user]);

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (superuserOnly && !isSuperuser) {
        // If the route is superuser only but the user is not a superuser, redirect or show a message
        return <Navigate to="/" />; // Redirect to home or another page
    }

    return <>{children}</>;
};

export default ProtectedRoute;
