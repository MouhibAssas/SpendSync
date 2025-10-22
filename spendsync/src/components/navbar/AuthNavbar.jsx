// src/components/AuthNavbar.jsx
import React from 'react';
import { FaDollarSign, FaChartLine, FaUsers, FaUser } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthNavbar = ({ onAddExpense, userProfileImage }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Determine active tab based on current path
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo & Brand (Left) */}
      <div 
        onClick={handleLogoClick}
        className="flex items-center cursor-pointer space-x-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <FaDollarSign className="text-white text-xl" />
        </div>
        <span className="text-xl font-bold">SpendSync</span>
      </div>

      {/* Centered Navigation Links (Desktop only) */}
      <div className="hidden md:flex items-center space-x-8">
        <button
          onClick={() => handleNavClick('/dashboard')}
          className={`flex items-center space-x-1 font-medium transition-colors ${
            isActive('/dashboard') 
              ? 'text-orange-400' 
              : 'text-white hover:text-orange-400'
          }`}
        >
          <FaChartLine /> <span>Dashboard</span>
        </button>
        <button
          onClick={() => handleNavClick('/feed')}
          className={`flex items-center space-x-1 font-medium transition-colors ${
            isActive('/feed') 
              ? 'text-orange-400' 
              : 'text-white hover:text-orange-400'
          }`}
        >
          <FaUsers /> <span>Feed</span>
        </button>
        <button
          onClick={() => handleNavClick('/profile')}
          className={`flex items-center space-x-1 font-medium transition-colors ${
            isActive('/profile') 
              ? 'text-orange-400' 
              : 'text-white hover:text-orange-400'
          }`}
        >
          <FaUser /> <span>Profile</span>
        </button>
      </div>

      {/* Right Section: Add Expense Button & Profile */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onAddExpense}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Expense
        </button>

        <div 
          onClick={handleProfileClick}
          className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
        >
          {userProfileImage ? (
            <img src={userProfileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <FaUser className="text-lg" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;