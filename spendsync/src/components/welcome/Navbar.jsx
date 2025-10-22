import React from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };
    const handleHome = () => {
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 md:px-12 lg:px-16">
      
      <div onClick={handleHome} className="flex items-center   cursor-pointer space-x-2 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <FaDollarSign className="text-white text-xl" />
        </div>
        <span className="text-xl font-bold">SpendSync</span>
      </div>
      <div className="flex space-x-6">
        <button 
          onClick={handleLogin}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Log In
        </button>
        <button 
          onClick={handleGetStarted}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;