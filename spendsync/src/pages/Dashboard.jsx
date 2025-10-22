// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { FaDollarSign, FaCalendarAlt, FaChartBar, FaShare } from 'react-icons/fa'; // Added FaShare

const Dashboard = () => {
  const [todaySpending, setTodaySpending] = useState(142.5);
  const [thisWeekSpending, setThisWeekSpending] = useState(687.2);
  const [thisMonthSpending, setThisMonthSpending] = useState(2341.8);

  const [filter, setFilter] = useState('today');

  const expenses = [
    {
      id: 1,
      title: 'Lunch at Restaurant',
      category: 'Food',
      amount: -42.5,
      time: '12:30 PM',
      note: 'Had a great meal with colleagues',
      icon: '🍽️'
    },
    {
      id: 2,
      title: 'Uber Ride',
      category: 'Transport',
      amount: -18.2,
      time: '9:15 AM',
      note: 'To downtown office',
      icon: '🚗'
    },
    {
      id: 3,
      title: 'Morning Coffee',
      category: 'Food',
      amount: -6.8,
      time: '8:00 AM',
      note: 'Starbucks latte',
      icon: '☕'
    }
  ];

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
   

      <main className="container mx-auto px-6 py-8 md:px-8 lg:px-10">
        {/* Spending Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today - keep yellow */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base text-gray-400">Today's Spending</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">${todaySpending.toFixed(2)}</p>
              </div>
              <FaDollarSign className="text-orange-500 text-2xl" />
            </div>
          </div>

          {/* This Week - now WHITE */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-white mt-1">${thisWeekSpending.toFixed(2)}</p>
              </div>
              <FaChartBar className="text-orange-500 text-2xl" />
            </div>
          </div>

          {/* This Month - now WHITE */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-white mt-1">${thisMonthSpending.toFixed(2)}</p>
              </div>
              <FaCalendarAlt className="text-orange-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-gray-800 p-4 rounded-xl mb-8">
          <div className="flex flex-wrap gap-3">
            {['today', 'last3days', 'week', 'month', 'custom'].map((option) => (
              <button
                key={option}
                onClick={() => handleFilterChange(option)}
                className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
                  filter === option
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option === 'last3days' ? 'Last 3 days' : 
                 option === 'custom' ? 'Custom' : 
                 option === 'today' ? 'Today' :
                 `1 ${option}`}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses List */}
        <h2 className="text-2xl font-bold mb-6">Today's Expenses</h2>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div 
              key={expense.id} 
              className="bg-gray-800 p-5 rounded-xl shadow flex justify-between items-start hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                  {expense.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{expense.title}</h3>
                  <p className="text-gray-300">{expense.category} • {expense.time}</p>
                  {/* ✅ Improved description color: from gray-500 → gray-400 (more readable) */}
                  <p className="text-gray-400 text-sm mt-1">{expense.note}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-bold text-lg">${Math.abs(expense.amount).toFixed(2)}</p>
                {/* ✅ Replaced invisible "→" with a visible share icon */}
                <button className="text-gray-400 hover:text-orange-400 mt-2 flex justify-end">
                  <FaShare className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;