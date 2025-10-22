// src/pages/Profile.jsx
import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import AuthNavbar from '../../components/navbar/AuthNavbar';

const Profile = () => {
  const [profile] = useState({
    username: '@your_username',
    bio: 'Expense Tracking Enthusiast',
    tagline: 'Love sharing my spending journey and helping friends stay financially mindful! 💰',
    expensesShared: 156,
    friends: 89,
    memberSince: 'Jan 2024',
    avatar: '/avatars/user.jpg'
  });

  const sharedExpenses = [
    {
      id: 1,
      title: 'Lunch at Restaurant',
      timeAgo: '2 hours ago',
      likes: 24,
      amount: -42.50,
      icon: '🍽️'
    },
    {
      id: 2,
      title: 'Grocery Shopping',
      timeAgo: '1 day ago',
      likes: 18,
      amount: -87.30,
      icon: '🛒'
    }
  ];

  const handleEditProfile = () => {
    alert('Edit Profile clicked');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AuthNavbar 
        onAddExpense={() => alert('Add Expense clicked')} 
        userProfileImage={profile.avatar} 
      />

      <main className="container mx-auto px-6 py-8 md:px-8 lg:px-10">
        {/* Profile Header - with light gray border */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start space-x-6">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-orange-500"
              />
              <div>
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <p className="text-orange-500 text-base mb-2">{profile.bio}</p>
                <p className="text-gray-300 text-base mb-3 max-w-2xl">{profile.tagline}</p>
                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                  <span>{profile.expensesShared} expenses shared</span>
                  <span>{profile.friends} friends</span>
                  <span>Member since {profile.memberSince}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 self-start"
            >
              <FaEdit /> <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* "Your Shared Expenses" Section - with light gray border */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Your Shared Expenses</h2>
          
          <div className="space-y-4">
            {sharedExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="bg-gray-700 p-4 rounded-lg border border-gray-700 flex justify-between items-start hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-lg">
                    {expense.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{expense.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{expense.timeAgo} • {expense.likes} likes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="!text-yellow-400 font-bold text-lg">${Math.abs(expense.amount).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;