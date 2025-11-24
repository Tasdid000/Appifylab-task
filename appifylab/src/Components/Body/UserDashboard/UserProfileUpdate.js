import React, { useState } from 'react';
import axios from 'axios';

const UserProfileUpdate = ({ userData }) => {
    const [updatedUserData, setUpdatedUserData] = useState({
        first_name: userData.data.first_name || '',
        last_name: userData.data.last_name || '',
        email: userData.data.email || '',
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Only update the field that changed
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if at least one field is changed
        if (
            updatedUserData.first_name === userData.data.first_name &&
            updatedUserData.last_name === userData.data.last_name &&
            updatedUserData.email === userData.data.email
        ) {
            setError('Nothing here for change.');
            return;
        }

        try {
            await axios.put(
                `http://127.0.0.1:8000/apiv1/user/update_profile/${userData.data.email}/`,
                updatedUserData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );
            setSuccessMessage('Profile updated successfully');
            setError(null);

            // reload the page
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.detail || 'Error updating profile');
            } else {
                setError('Error updating profile');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h3 className="text-4xl font-semibold mb-4 text-blue-700">Personal Information</h3>

            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-blue-700">{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bluetext-blue-700 focus:border-bluetext-blue-700 sm:text-sm"
                        placeholder={userData.data.first_name}
                        value={updatedUserData.first_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bluetext-blue-700 focus:border-bluetext-blue-700 sm:text-sm"
                        placeholder={userData.data.last_name}
                        value={updatedUserData.last_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bluetext-blue-700 focus:border-bluetext-blue-700 sm:text-sm"
                        placeholder={userData.data.email}
                        value={updatedUserData.email}
                        onChange={handleChange}
                        readOnly
                    />
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-50 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfileUpdate;