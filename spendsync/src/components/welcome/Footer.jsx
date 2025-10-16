import React from 'react';
import { FaDollarSign } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="px-6 py-8 md:px-12 lg:px-16 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <FaDollarSign className="text-white" />
          </div>
          <span className="text-lg font-bold">SpendSync</span>
        </div>
        <p className="text-gray-400 text-sm">
          © 2023 SpendSync. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;