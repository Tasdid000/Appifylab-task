import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./login and registration/registration";
import LoginPage from "./login and registration/login";
import CreateFeed from "./Feed/CreateFeed";
import { isAuthenticated } from './utils/auth';
import UserComponents from "./UserDashboard/UserComponents";
import PrivateRoute from '../Body/PrivateRoute';
import Home from "./Home";

const Body = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<PrivateRoute element={<Home />} />} />
                <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/createFeed" element={<PrivateRoute element={<CreateFeed />} />} />
                <Route path="/dashboard/*" element={<PrivateRoute element={<UserComponents />} />} />             
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default Body;
