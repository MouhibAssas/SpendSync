import React, { useState, useEffect } from 'react';
import { FaDollarSign, FaCalendarAlt, FaChartBar, FaShare, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getExpenses, addExpense } from '../services/expenseService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todaySpending, setTodaySpending] = useState(0);
  const [thisWeekSpending, setThisWeekSpending] = useState(0);
  const [thisMonthSpending, setThisMonthSpending] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    isPublic: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('today');

  // Sample expenses for now - will be replaced with API data
  const sampleExpenses = [
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

  useEffect(() => {
    // Listen for add expense event from navbar
    const handleAddExpenseEvent = () => {
      console.log('📱 Add Expense button clicked - opening modal');
      setShowAddExpense(true);
    };

    const dashboardElement = document.querySelector('[data-dashboard]');
    console.log('🎯 Dashboard element found:', dashboardElement);

    if (dashboardElement) {
      console.log('✅ Adding event listener for addExpense');
      dashboardElement.addEventListener('addExpense', handleAddExpenseEvent);
    } else {
      console.warn('❌ Dashboard element not found for event listener');
    }

    return () => {
      if (dashboardElement) {
        console.log('🧹 Removing event listener for addExpense');
        dashboardElement.removeEventListener('addExpense', handleAddExpenseEvent);
      }
    };
  }, []);

  useEffect(() => {
    // Load user-specific dashboard data
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real expenses from API
        const userExpenses = await getExpenses();

        // Calculate spending totals
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const todayExpenses = userExpenses.filter(expense => new Date(expense.createdAt) >= today);
        const weekExpenses = userExpenses.filter(expense => new Date(expense.createdAt) >= weekStart);
        const monthExpenses = userExpenses.filter(expense => new Date(expense.createdAt) >= monthStart);

        setTodaySpending(todayExpenses.reduce((sum, exp) => sum + exp.amount, 0));
        setThisWeekSpending(weekExpenses.reduce((sum, exp) => sum + exp.amount, 0));
        setThisMonthSpending(monthExpenses.reduce((sum, exp) => sum + exp.amount, 0));

        // Transform expenses for display
        const transformedExpenses = userExpenses.slice(0, 10).map(expense => ({
          id: expense._id,
          title: expense.description,
          category: expense.category,
          amount: -expense.amount, // Negative for display
          time: new Date(expense.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          note: expense.location || 'No location',
          icon: getCategoryIcon(expense.category)
        }));

        setExpenses(transformedExpenses);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError('Failed to load expenses. Please try again.');
        setLoading(false);
        
        // If it's an authentication error, redirect to login - TEMPORARILY DISABLED FOR TESTING
        if (error.response?.status === 401) {
          // logout();
          // navigate('/login');
          console.log('401 error in Dashboard - redirect disabled for testing')
        }
      }
    };

    if (user) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user, logout, navigate]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍽️',
      transport: '🚗',
      shopping: '🛒',
      entertainment: '🎬',
      bills: '💡',
      health: '🏥',
      other: '📦'
    };
    return icons[category] || '📦';
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        isPublic: newExpense.isPublic
      };

      await addExpense(expenseData);

      // Reset form and close modal
      setNewExpense({
        description: '',
        amount: '',
        category: 'food',
        isPublic: false
      });
      setShowAddExpense(false);

      // Refresh dashboard data
      window.location.reload();
    } catch (error) {
      console.error('Failed to add expense:', error);
      setError('Failed to add expense. Please try again.');
    }
  };

  const handleExpenseInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white" data-dashboard>
      <main className="container mx-auto px-6 py-8 md:px-8 lg:px-10">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Welcome Message */}
        {user && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.fullName}!</h1>
            <p className="text-gray-400">Here's your spending overview for today.</p>
          </div>
        )}

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

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Add New Expense</h3>
              <form onSubmit={handleSubmitExpense}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={newExpense.description}
                      onChange={handleExpenseInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="What did you spend on?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={newExpense.amount}
                      onChange={handleExpenseInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newExpense.category}
                      onChange={handleExpenseInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="food">🍽️ Food</option>
                      <option value="transport">🚗 Transport</option>
                      <option value="shopping">🛒 Shopping</option>
                      <option value="entertainment">🎬 Entertainment</option>
                      <option value="bills">💡 Bills</option>
                      <option value="health">🏥 Health</option>
                      <option value="other">📦 Other</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={newExpense.isPublic}
                      onChange={handleExpenseInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-300">
                      Share this expense publicly
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <h2 className="text-2xl font-bold mb-6">
          {user ? `${user.fullName}'s Expenses` : 'Today\'s Expenses'}
        </h2>
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
                  <p className="text-gray-400 text-sm mt-1">{expense.note}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-bold text-lg">${Math.abs(expense.amount).toFixed(2)}</p>
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