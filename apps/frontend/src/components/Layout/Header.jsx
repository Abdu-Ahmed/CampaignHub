import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';

export default function Header() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Center everything */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <Link to="/">CampaignHub</Link>
          </h1>
          {/* Welcome message or login options */}
          {token && user ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="text-xl text-gray-700">
                Welcome, <strong className="text-indigo-700">{user.name}</strong>!
              </div>
              {/* Navigation buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboards')}
                  className="text-purple-600 hover:text-purple-800 font-medium px-3 py-1 rounded-md hover:bg-purple-50 transition-colors"
                >
                  Dashboards
                </button>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-gray-700 text-lg">Welcome to CampaignHub</span>
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Log In
                </Link>
                <span className="text-gray-500">or</span>
                <Link
                  to="/signup"
                  className="text-green-600 hover:text-green-800 font-medium px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}