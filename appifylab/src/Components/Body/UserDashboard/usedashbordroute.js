import React from 'react';
import UserProfile from './userprofile';
import LogoutPage from '../login and registration/Logout';
import { Routes, Route, Navigate } from 'react-router-dom';
import OwnFeedList from './OwnFeed/ownFeedList';
import EditFeed from './OwnFeed/Editownfeed';



const UserDashboardroute = () => {
    return (
        <div className="flex h-screen">
            <Routes>
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/own-feed" element={<OwnFeedList />} />
                <Route path="/edit-feed/:id" element={<EditFeed />} />
                <Route path="/" element={<Navigate to="userprofile" replace />} />
            </Routes>
        </div>
    );
}

export default UserDashboardroute;
