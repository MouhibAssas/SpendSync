import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { listPurchases, addPurchase } from '../services/purchasesService'
import toast from 'react-hot-toast'
import { 
  FaDollarSign, 
  FaEye, 
  FaEyeSlash, 
  FaShare, 
  FaPlus,
  FaCamera,
  FaHeart,
  FaComment,
  FaMapMarkerAlt,
  FaClock,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaGlobe,
  FaLock
} from 'react-icons/fa'

function Dashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const fileInputRef = useRef(null)
  
  // Load expenses
  useEffect(() => {
    (async () => {
      try {
        const data = await listPurchases({ 
          rangeStart: new Date(new Date().setHours(0,0,0,0)).toISOString(),
          rangeEnd: new Date().toISOString()
        })
        setItems(data)
      } catch (e) {
        // error toast handled globally
      }
    })()
  }, [])
  
  const handleAddExpense = async (expenseData) => {
    try {
      const created = await addPurchase({
        ...expenseData,
        timestamp: new Date().toISOString()
      })
      setItems(prev => [created, ...prev])
      toast.success('Expense added!')
      setShowAddExpense(false)
    } catch (e) {
      // global toast already shown
    }
  }
  
  const togglePublicStatus = async (id, currentStatus) => {
    try {
      // This would be an API call to update the expense
      // For now, we'll update the local state
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, isPublic: !currentStatus } : item
      ))
      toast.success(`Expense is now ${!currentStatus ? 'public' : 'private'}`)
    } catch (e) {
      toast.error('Failed to update expense')
    }
  }
  
  const handleLike = (id) => {
    // Handle like functionality
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item
    ))
  }
  
  const filteredAndSortedItems = () => {
    let filtered = items
    
    // Apply filter
    if (filter === 'public') {
      filtered = filtered.filter(item => item.isPublic)
    } else if (filter === 'private') {
      filtered = filtered.filter(item => !item.isPublic)
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.timestamp) - new Date(a.timestamp)
      if (sortBy === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp)
      if (sortBy === 'highest') return b.amount - a.amount
      if (sortBy === 'lowest') return a.amount - b.amount
      return 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.fullName || 'User'}!
            </h1>
            <p className="text-gray-400 mt-1">Track your expenses and share with friends</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddExpense(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Spent</span>
                <FaDollarSign className="text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                ${items.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Public Expenses</span>
                <FaGlobe className="text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                ${items.filter(item => item.isPublic).reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Private Expenses</span>
                <FaLock className="text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                ${items.filter(item => !item.isPublic).reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Filter:</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                      filter === 'all' 
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400' 
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilter('public')}
                    className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                      filter === 'public' 
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400' 
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    Public
                  </button>
                  <button 
                    onClick={() => setFilter('private')}
                    className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                      filter === 'private' 
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400' 
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Sort:</span>
                <div className="relative">
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-gray-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest</option>
                    <option value="lowest">Lowest</option>
                  </select>
                  <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search expenses..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <FaDollarSign /> Your Expenses
            </h2>
            
            {filteredAndSortedItems().length > 0 ? (
              <div className="space-y-3">
                {filteredAndSortedItems().map((expense) => (
                  <motion.div
                    key={expense.id || expense._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium text-white">{expense.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            expense.isPublic 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {expense.isPublic ? (
                              <span className="flex items-center gap-1">
                                <FaGlobe className="text-xs" /> Public
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FaLock className="text-xs" /> Private
                              </span>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="bg-gray-800 px-2 py-1 rounded">{expense.category}</span>
                          {expense.location && (
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-xs" /> {expense.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FaClock className="text-xs" /> {new Date(expense.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-orange-400">${parseFloat(expense.amount).toFixed(2)}</span>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => togglePublicStatus(expense.id || expense._id, expense.isPublic)}
                            className={`p-2 rounded-lg transition-colors ${
                              expense.isPublic 
                                ? 'text-blue-400 hover:bg-blue-500/20' 
                                : 'text-green-400 hover:bg-green-500/20'
                            }`}
                            title={expense.isPublic ? 'Make private' : 'Make public'}
                          >
                            {expense.isPublic ? <FaGlobe /> : <FaLock />}
                          </button>
                          
                          {expense.isPublic && (
                            <>
                              <button 
                                onClick={() => handleLike(expense.id || expense._id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                title="Like"
                              >
                                <FaHeart />
                                {expense.likes && <span className="text-xs ml-1">{expense.likes}</span>}
                              </button>
                              
                              <button 
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                                title="Comment"
                              >
                                <FaComment />
                                {expense.comments && <span className="text-xs ml-1">{expense.comments}</span>}
                              </button>
                              
                              <button 
                                className="p-2 rounded-lg text-gray-400 hover:text-green-400 transition-colors"
                                title="Share"
                              >
                                <FaShare />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaDollarSign className="text-gray-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No expenses found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
                <button 
                  onClick={() => setShowAddExpense(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Your First Expense
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Modal */}
        <AnimatePresence>
          {showAddExpense && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddExpense(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Add Expense</h2>
                  <button
                    onClick={() => setShowAddExpense(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <AddExpenseForm onSubmit={handleAddExpense} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Add Expense Form Component
function AddExpenseForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [location, setLocation] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const categories = [
    'Food', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
  ]

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size should be less than 5MB')
        return
      }
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !amount) return
    
    onSubmit({
      title,
      amount: parseFloat(amount),
      category,
      location,
      isPublic,
      photo
    })
    
    // Reset form
    setTitle('')
    setAmount('')
    setCategory('Food')
    setLocation('')
    setIsPublic(false)
    setPhoto(null)
    setPhotoPreview(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">What did you spend on?</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Coffee, lunch, groceries..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          required
        />
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
          <span className="text-gray-400 mr-2">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
            required
          />
        </div>
      </div>

      {/* Category Select */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Location Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Location (optional)</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Starbucks, downtown..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Photo (optional)</label>
        <div className="flex items-center gap-4">
          {photoPreview ? (
            <div className="relative">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto(null)
                  setPhotoPreview(null)
                }}
                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-20 h-20 bg-gray-800 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-700"
            >
              <FaCamera className="text-gray-400 text-xl mb-1" />
              <span className="text-xs text-gray-400">Add Photo</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Public Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPublic 
                ? 'bg-blue-500' 
                : 'bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
              isPublic ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
          <span className="ml-3 text-sm text-gray-300">
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Add Expense
      </button>
    </form>
  )
}

export default Dashboard