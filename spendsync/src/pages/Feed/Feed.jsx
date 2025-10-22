// src/pages/Feed.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import AuthNavbar from '../../components/navbar/AuthNavbar';

const Feed = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock feed data
  const feedItems = [
    {
      id: 1,
      username: '@alex_johnson',
      time: '2h ago',
      title: 'Expensive dinner tonight!',
      description: 'Tried that new sushi place downtown. Worth every penny! 🍣',
      category: 'Food • Sushi Restaurant',
      amount: -89.50,
      likes: 24,
      comments: 8,
      avatar: '/avatars/alex.jpg'
    },
    {
      id: 2,
      username: '@sarah_m',
      time: '4h ago',
      title: 'New workout gear',
      description: 'Finally got those running shoes I\'ve been eyeing! 👟',
      category: 'Shopping • Sports Store',
      amount: -120.00,
      likes: 12,
      comments: 3,
      avatar: '/avatars/sarah.jpg'
    }
  ];

  const filteredFeed = feedItems.filter(item =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AuthNavbar onAddExpense={() => alert('Add Expense clicked')} userProfileImage="/default-profile.jpg" />

      <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Friends Feed</h1>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFeed.map((item) => (
            <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={item.avatar}
                  alt={item.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.username}</span>
                    <span className="text-xs text-gray-400">• {item.time}</span>
                  </div>
                  <h3 className="font-semibold text-orange-400 mt-1">{item.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                </div>
              </div>

              {/* Expense Card */}
              <div className="bg-gray-700 p-3 rounded-md mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{item.category}</span>
                  <span className="text-yellow-400 font-bold">${Math.abs(item.amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Interaction Stats */}
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <button className="flex items-center space-x-1 hover:text-white">
                  <span>❤️</span> <span>{item.likes}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-white">
                  <span>💬</span> <span>{item.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;