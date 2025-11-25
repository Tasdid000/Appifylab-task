import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        'http://127.0.0.1:8000/apiv1/user/delete_user/',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      console.log(response.data);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.reload();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="p-6 shadow-sm rounded-lg">
      <h3 className="text-2xl font-semibold text-red-600 mb-4">
        Account Deletion
      </h3>
      <p className="text-gray-700 mb-4">
        Deleting your account is permanent. Once your account is deleted, you will lose access to your data and services.
      </p>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
        onClick={() => setShowModal(true)}
      >
        Delete Account
      </button>

      {/* Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg shadow-xl w-full max-w-md">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Account Deletion
            </h4>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-gray-100 rounded-md hover:bg-red-700 transition-colors duration-200"
                onClick={handleDeleteAccount}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
