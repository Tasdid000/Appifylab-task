import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        password: '',
        password2: '',
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Password visibility state
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        password: false,
        password2: false,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prevPasswords) => ({
            ...prevPasswords,
            [name]: value,
        }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPassword((prevShowPassword) => ({
            ...prevShowPassword,
            [field]: !prevShowPassword[field],
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error message at the start

        // Validation checks
        if (!passwords.currentPassword || !passwords.password || !passwords.password2) {
            setError('All fields must be filled.');
            return;
        }

        if (passwords.password !== passwords.password2) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/apiv1/user/changepassword/',
                {
                    current_password: passwords.currentPassword,
                    password: passwords.password,
                    password2: passwords.password2,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            // Handle success
            if (response.status === 200) {
                setSuccessMessage('Password changed successfully.');
                setPasswords({ currentPassword: '', password: '', password2: '' }); // Clear the form after success
            }
        } catch (error) {
            // Handle error
            if (error.response && error.response.data) {
                setError(error.response.data.detail || 'Error changing password.');
            } else {
                setError('Error changing password.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-3">
            <h2 className="text-4xl font-semibold mb-4 text-blue-700">Change<br /> Password</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && <p className="text-blue-700 mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4 relative">
                    <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                        Current Password:
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword.currentPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-7text-blue-700"
                            id="currentPassword"
                            name="currentPassword"
                            placeholder="Enter Current Password"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                        />
                        <span
                            onClick={() => togglePasswordVisibility('currentPassword')}
                            className="absolute right-3 top-3 cursor-pointer text-blue-700"
                        >
                            {showPassword.currentPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                        </span>
                    </div>
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        New Password:
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword.password ? 'text' : 'password'}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-7text-blue-700"
                            id="password"
                            name="password"
                            placeholder="Enter New Password"
                            value={passwords.password}
                            onChange={handleChange}
                        />
                        <span
                            onClick={() => togglePasswordVisibility('password')}
                            className="absolute right-3 top-3 cursor-pointer text-blue-700"
                        >
                            {showPassword.password ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                        </span>
                    </div>
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="password2" className="block text-gray-700 font-medium mb-2">
                        Confirm Password:
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword.password2 ? 'text' : 'password'}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-7text-blue-700"
                            id="password2"
                            name="password2"
                            placeholder="Confirm your Password"
                            value={passwords.password2}
                            onChange={handleChange}
                        />
                        <span
                            onClick={() => togglePasswordVisibility('password2')}
                            className="absolute right-3 top-3 cursor-pointer text-blue-700"
                        >
                            {showPassword.password2 ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                        </span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
