import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FeedList from './FeedList';

const FeedPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const access_token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!access_token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/apiv1/user/userprofile/', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                setUser(response.data.data || response.data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError(err.response?.data?.message || 'Failed to load profile');
                if (err.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [access_token]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your feed...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <p className="text-red-600 font-medium mb-4">Oops! Something went wrong</p>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Create Post Box - Only for logged-in users */}
            {user && (
                <div className="max-w-4xl mx-auto px-4 pt-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-center gap-3">
                                {/* Profile Picture */}
                                <div className="flex-shrink-0">
                                    {user.image ? (
                                        <img
                                            src={`http://127.0.0.1:8000${user.image}`}
                                            alt={user.first_name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {user.first_name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Create Post Input */}
                                <Link to="/createFeed" className="flex-1">
                                    <button className="w-full text-left px-5 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 font-medium transition text-base">
                                        What's on your mind, {user.first_name}?
                                    </button>
                                </Link>
                            </div>                            
                        </div>
                    </div>
                </div>
            )}

            {/* Feed Posts */}
            <div className="max-w-4xl mx-auto mt-6 px-4 pb-10">
                <FeedList />
            </div>
        </div>
    );
};

export default FeedPage;