import React from 'react';
import useUserProfile from './userprofilehookup';
import UserProfileUpdate from './UserProfileUpdate';
import UserProfileCard from './UserProfileCard';
import ChangePassword from './CahngePassword';
import AccountSettings from './DeleteAccount';

const UserProfile = () => {
  const { userData, loading, error } = useUserProfile();

  return (
    <div className="mt-16 px-4 lg:px-12">
      {loading && (
        <p className="text-center text-gray-600 text-lg">Loading user profile...</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-lg">Error: {error}</p>
      )}
      {userData && (
        <div className="space-y-10">
          {/* User Profile Card section*/}
          <UserProfileCard userData={userData} />

          {/* Update Personal Information and Profile section*/}
          <div className="pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm rounded-xl p-8">
                <UserProfileUpdate userData={userData} />
              </div>
            </div>
          </div>

          {/* Change Password section*/}
          <div className="pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm rounded-xl p-8">
                <ChangePassword />
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="pt-10">
            <hr className="my-6 border-gray-300" />
            <h4 className="text-xl font-semibold text-red-600">Delete Account</h4>
            <div className="bg-red-100 rounded-lg p-4 my-4 text-red-600 flex items-center">
              <i className="fas fa-exclamation-triangle pr-2"></i>
              <span>Proceed with caution</span>
            </div>
            <p className="text-gray-700 mb-4">
              Make sure to back up your data. Once deleted, your account and all associated data cannot be recovered.
            </p>
            <p className="text-gray-800 mb-4">
              Are you sure you want to delete your account?
            </p>
            <div className="p-8">
              <AccountSettings />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
