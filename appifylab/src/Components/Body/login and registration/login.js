import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff} from "lucide-react";
import './styles.css';
import Googlelogin from './googleligin';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submit = async (e) => {
    e.preventDefault();
    const user = { email, password };

    try {
      const { data } = await axios.post("http://127.0.0.1:8000/token/", user);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      window.location.reload("/blog");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Error in token fetch");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-500">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">

        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src='/assets/login.png'
            alt="Login Visual"
            className="w-full h-full"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8 mt-10 mb-10">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h3>

          {error && (
            <div className="text-red-600 text-center mb-4 border border-red-300 bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6 mt-10">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
                  style={{ fontSize: "15px" }}
                  placeholder="Enter your email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  className="w-full pl-12 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontSize: "15px" }}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className=" px-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="mt-6 px-16 text-center">
            <p className="mb-2">OR</p>
            <Googlelogin />
          </div>
          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline hover:text-blue-600">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
