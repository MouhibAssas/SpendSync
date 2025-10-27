// src/components/AuthNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaDollarSign, FaChartLine, FaUsers, FaUser, FaCog, FaSignOutAlt , FaChevronDown } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthNavbar = ({ onAddExpense }) => {
	const { user, logout } = useAuth();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };


  const handleSettingsClick = () => {
    navigate('/settings');
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
          >
            {user?.profilePhoto ? (
              <img src={`http://localhost:4000${user.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <FaUser className="text-lg" />
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-700">
                <p className="text-sm font-medium text-white">{user?.fullName}</p>
                <p className="text-xs text-gray-400">@{user?.username}</p>
              </div>

              <button
                onClick={() => {
                  navigate('/profile');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center transition-colors"
              >
                <FaUser className="mr-2" />
                See Profile
              </button>

              <button
                onClick={handleSettingsClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center transition-colors"
              >
                <FaCog className="mr-2" />
                Settings
              </button>

              <div className="border-t border-gray-700 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center transition-colors"
              >
                <FaSignOutAlt  className="mr-2" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;