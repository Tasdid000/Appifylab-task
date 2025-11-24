import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserProfile from '../UserDashboard/userprofilehookup';

const LogoutPage = () => {
    const navigate = useNavigate();
    const { loading, error } = useUserProfile();

    useEffect(() => {
        const handleLogout = () => {
            // Remove tokens from localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('userData');

            // Redirect to the login page
            window.location.reload("/");
        };

        handleLogout();
    }, [navigate]);

    if (loading) {
        return <p>Logging out...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default LogoutPage;
