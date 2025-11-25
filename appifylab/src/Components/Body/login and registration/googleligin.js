import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Googlelogin = () => {
    const [error, setError] = useState("");
    const [googleClientId, setGoogleClientId] = useState(null);

    useEffect(() => {
        const fetchGoogleClientId = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/apiv1/user/google-client-id/', {

                });
                setGoogleClientId(response.data.google_client_id);
            } catch (error) {
                setError("Failed to fetch Google Client ID");
            }
        };
        fetchGoogleClientId();
    }, []);
    // Google login handler
    const handleGoogleLogin = async (response) => {
        const { credential } = response; 

        try {
            // Send the Google ID token to the backend for validation
            const { data } = await axios.post("http://127.0.0.1:8000/apiv1/user/google-login/", { token: credential });

            // Store JWT tokens
            localStorage.setItem('access_token', data.token.access);
            localStorage.setItem('refresh_token', data.token.refresh);
            window.location.href = "/";
        } catch (error) {
            setError("Google login failed. Please try again.");
        }
    };

    // If the Google Client ID is not yet fetched, show loading
    if (!googleClientId) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleOAuthProvider clientId={googleClientId}> {/* Use the fetched Google Client ID */}
            <div className='mb-10'>
                {error && <div className="text-red-600 text-center mb-4 bg-red-100 p-3 rounded-lg">{error}</div>}

                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => setError("Google login failed. Please try again.")}
                    useOneTap
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default Googlelogin;
