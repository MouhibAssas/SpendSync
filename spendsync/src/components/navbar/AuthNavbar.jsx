import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaDollarSign, 
  FaHome, 
  FaChartLine, 
  FaUsers, 
  FaSearch, 
  FaBell, 
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaCamera,
  FaHeart,
  FaComment
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'like', user: 'John Doe', message: 'liked your expense post', time: '2 min ago', read: false },
    { id: 2, type: 'comment', user: 'Jane Smith', message: 'commented on your post', time: '15 min ago', read: false },
    { id: 3, type: 'follow', user: 'Mike Johnson', message: 'started following you', time: '1 hour ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: FaHome },
    { to: '/expenses', label: 'Expenses', icon: FaDollarSign },
    { to: '/analytics', label: 'Analytics', icon: FaChartLine },
    { to: '/social', label: 'Social Feed', icon: FaUsers },
  ];

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: "-100%",
      transition: {
        duration: 0.2
      }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 mr-8">
              <motion.div 
                className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <FaDollarSign className="text-white text-xl" />
              </motion.div>
              <span className="text-xl font-bold text-white">SpendSync</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      isActive 
                        ? 'bg-orange-500/20 text-orange-400' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:block relative" ref={searchRef}>
              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaSearch className="text-lg" />
              </motion.button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    onSubmit={handleSearch}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 top-12 w-80"
                  >
                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2">
                      <div className="flex items-center">
                        <FaSearch className="text-gray-400 mx-3" />
                        <input
                          type="text"
                          placeholder="Search users, expenses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none py-2"
                          autoFocus
                        />
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Add Expense Button */}
            <motion.button
              onClick={() => navigate('/expenses/new')}
              className="hidden sm:flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="text-sm" />
              <span>Add Expense</span>
            </motion.button>

            {/* Notifications */}
            {user && (
              <div className="relative" ref={notificationRef}>
                <motion.button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaBell className="text-lg" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-12 w-80"
                    >
                      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
                        <div className="p-4 border-b border-gray-700">
                          <h3 className="text-white font-semibold">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                                  !notification.read ? 'bg-orange-500/5' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    {notification.type === 'like' && <FaHeart className="text-red-400" />}
                                    {notification.type === 'comment' && <FaComment className="text-blue-400" />}
                                    {notification.type === 'follow' && <FaUsers className="text-green-400" />}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-white">
                                      <span className="font-semibold">{notification.user}</span> {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400">
                              No notifications yet
                            </div>
                          )}
                        </div>
                        <div className="p-3 border-t border-gray-700">
                          <button className="text-orange-400 hover:text-orange-300 text-sm font-medium w-full text-center">
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile Menu */}
            {user && (
              <div className="relative" ref={profileMenuRef}>
                <motion.button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-2xl text-gray-400" />
                  )}
                  <span className="hidden sm:block text-white font-medium">{user.username}</span>
                  <FaChevronDown className={`text-gray-400 text-sm transition-transform ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`} />
                </motion.button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-12 w-56"
                    >
                      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2">
                        <Link
                          to={`/profile/${user.username}`}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                          <FaUserCircle className="text-lg" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                          <FaCog className="text-lg" />
                          <span>Settings</span>
                        </Link>
                        <hr className="border-gray-700 my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 transition-colors w-full text-left"
                        >
                          <FaSignOutAlt className="text-lg" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-gray-800 border-t border-gray-700"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-orange-500/20 text-orange-400' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Add Expense */}
              <Link
                to="/expenses/new"
                className="flex items-center space-x-3 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <FaPlus className="text-lg" />
                <span>Add Expense</span>
              </Link>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3">
                <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  />
                </div>
              </form>

              {/* Mobile Profile Section */}
              {user && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-3xl text-gray-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Link
                      to={`/profile/${user.username}`}
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;