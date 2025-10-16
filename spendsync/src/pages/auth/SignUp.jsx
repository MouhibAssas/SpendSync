import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaGlobe, 
  FaCamera,
  FaExclamationCircle, 
  FaCheckCircle,
  FaUserCircle,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa'
import toast from 'react-hot-toast'

function SignUp() {
  const { signup, googleLogin } = useAuth()
  const navigate = useNavigate()
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    currency: 'USD'
  })
  
  // UI state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  // Password requirements state
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  })
  
  // Validation state
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: ''
  })
  
  // Ref for file input
  const fileInputRef = useRef(null)
  
  // Currency options
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar' }
  ]
  
  // Country options
  const countries = [
    'United States', 'United Kingdom', 'Tunisia','Canada', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil', 
    'Mexico', 'South Korea', 'Netherlands', 'Switzerland', 'Sweden', 
    'Norway', 'Denmark', 'Singapore', 'Other'
  ]
  
  // Steps configuration
  const steps = [
    { id: 1, title: 'Profile', description: 'Your basic information' },
    { id: 2, title: 'Contact', description: 'How to reach you' },
    { id: 3, title: 'Security', description: 'Create a strong password' },
    { id: 4, title: 'Terms', description: 'Agree to our terms' }
  ]
  
  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }
  
  // Check password requirements
  const checkPasswordRequirements = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^a-zA-Z0-9]/.test(password)
    }
    
    setPasswordRequirements(requirements)
    
    // Calculate strength based on how many requirements are met
    const metRequirements = Object.values(requirements).filter(Boolean).length
    return metRequirements
  }
  
  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return 0
    
    const metRequirements = checkPasswordRequirements(password)
    
    // Additional strength factors
    let strength = metRequirements
    
    // Extra points for length beyond minimum
    if (password.length >= 12) strength += 1
    if (password.length >= 16) strength += 1
    
    return Math.min(strength, 5) // Max strength is 5
  }
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Calculate password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }
  
  // Handle profile photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB')
        return
      }
      
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewPhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Validate current step
  const validateCurrentStep = () => {
    const errors = {}
    
    if (currentStep === 1) {
      // Profile step validation
      if (!formData.username.trim()) {
        errors.username = 'Username is required'
      } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters'
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores'
      }
      
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required'
      } else if (formData.fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters'
      }
    } else if (currentStep === 2) {
      // Contact step validation
      if (!formData.email.trim()) {
        errors.email = 'Email is required'
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address'
      }
      
      if (!formData.country) {
        errors.country = 'Please select your country'
      }
    } else if (currentStep === 3) {
      // Security step validation
      if (!formData.password) {
        errors.password = 'Password is required'
      } else if (!passwordRequirements.length) {
        errors.password = 'Password must be at least 8 characters'
      } else if (!passwordRequirements.uppercase) {
        errors.password = 'Password must contain at least one uppercase letter'
      } else if (!passwordRequirements.lowercase) {
        errors.password = 'Password must contain at least one lowercase letter'
      } else if (!passwordRequirements.number) {
        errors.password = 'Password must contain at least one number'
      } else if (!passwordRequirements.symbol) {
        errors.password = 'Password must contain at least one symbol'
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    } else if (currentStep === 4) {
      // Terms step validation
      if (!termsAccepted) {
        errors.terms = 'You must accept the terms and conditions'
      }
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  // Handle next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    
    if (!validateCurrentStep()) {
      return
    }
    
    setLoading(true)
    try {
      await signup(
        formData.email, 
        formData.password, 
        formData.fullName,
        formData.username,
        formData.country,
        formData.currency,
        profilePhoto
      )
      setSuccessMessage('Account created successfully! Redirecting...')
      toast.success('Account created')
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.')
      toast.error('Sign up failed')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle Google sign-up
  async function handleGoogle() {
    setError('')
    setSuccessMessage('')
    setLoading(true)
    try {
      await googleLogin()
      setSuccessMessage('Account created successfully! Redirecting...')
      toast.success('Signed in with Google')
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
      toast.error('Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  }
  
  const stepVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  }
  
  // Password strength colors
  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-700'
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength === 3) return 'bg-orange-500'
    if (passwordStrength === 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  // Password strength text
  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ''
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength === 3) return 'Fair'
    if (passwordStrength === 4) return 'Good'
    return 'Strong'
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-6 relative overflow-hidden py-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Brand section */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join SpendSync to track your expenses</p>
        </motion.div>

        {/* Progress indicator - FIXED VERSION */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="relative">
            {/* Progress line background */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700"></div>
            
            {/* Active progress line */}
            <div 
              className="absolute top-5 left-0 h-0.5 bg-orange-500 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {/* Step circles */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep > step.id 
                      ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/50' 
                      : currentStep === step.id 
                        ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/50 ring-4 ring-orange-500/20' 
                        : 'bg-gray-800 border-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <FaCheck className="text-white text-sm" />
                    ) : (
                      <span className="text-white text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Step labels */}
          <div className="flex justify-between mt-3">
            {steps.map((step) => (
              <span key={step.id} className={`text-xs transition-colors duration-300 ${
                currentStep === step.id ? 'text-orange-400 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Sign up form card */}
        <motion.div 
          className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl"
          variants={itemVariants}
        >
          {/* Error message */}
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationCircle className="text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Success message */}
          {successMessage && (
            <motion.div 
              className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaCheckCircle className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-green-400 text-sm">{successMessage}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Profile Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  
                  {/* Profile Photo */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo (Optional)</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {previewPhoto ? (
                          <img 
                            src={previewPhoto} 
                            alt="Profile preview" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                            <FaUserCircle className="text-gray-400 text-3xl" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-full transition-colors"
                        >
                          <FaCamera className="text-xs" />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Upload a profile photo</p>
                        <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </div>
                  </motion.div>

                  {/* Username field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input 
                        name="username"
                        value={formData.username} 
                        onChange={handleInputChange} 
                        type="text" 
                        placeholder="johndoe" 
                        className={`w-full bg-gray-900 border ${fieldErrors.username ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`} 
                        required 
                      />
                    </div>
                    {fieldErrors.username && (
                      <motion.p 
                        className="mt-1 text-xs text-red-400 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationCircle className="mr-1" /> {fieldErrors.username}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Full Name field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input 
                        name="fullName"
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        type="text" 
                        placeholder="John Doe" 
                        className={`w-full bg-gray-900 border ${fieldErrors.fullName ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`} 
                        required 
                      />
                    </div>
                    {fieldErrors.fullName && (
                      <motion.p 
                        className="mt-1 text-xs text-red-400 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationCircle className="mr-1" /> {fieldErrors.fullName}
                      </motion.p>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  
                  {/* Email field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input 
                        name="email"
                        value={formData.email} 
                        onChange={handleInputChange} 
                        type="email" 
                        placeholder="your@email.com" 
                        className={`w-full bg-gray-900 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`} 
                        required 
                      />
                    </div>
                    {fieldErrors.email && (
                      <motion.p 
                        className="mt-1 text-xs text-red-400 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationCircle className="mr-1" /> {fieldErrors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Country field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaGlobe className="text-gray-400" />
                      </div>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-900 border ${fieldErrors.country ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors appearance-none`}
                        required
                      >
                        <option value="" disabled>Select your country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    {fieldErrors.country && (
                      <motion.p 
                        className="mt-1 text-xs text-red-400 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationCircle className="mr-1" /> {fieldErrors.country}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Currency field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Currency</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">
                          {currencies.find(c => c.code === formData.currency)?.symbol || '$'}
                        </span>
                      </div>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Security */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-semibold mb-4">Security</h2>
                  
                  {/* Password field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input 
                        name="password"
                        value={formData.password} 
                        onChange={handleInputChange} 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className={`w-full bg-gray-900 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-orange-500 transition-colors`} 
                        required 
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-gray-400 hover:text-gray-300" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password requirements */}
                    {formData.password && (
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">Password requirements</span>
                          <span className={`text-xs ${passwordStrength <= 2 ? 'text-red-400' : passwordStrength === 3 ? 'text-orange-400' : passwordStrength === 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            {passwordRequirements.length ? (
                              <FaCheck className="text-green-400 mr-2" />
                            ) : (
                              <FaTimes className="text-gray-500 mr-2" />
                            )}
                            <span className={passwordRequirements.length ? 'text-green-400' : 'text-gray-400'}>
                              At least 8 characters
                            </span>
                          </div>
                          
                          <div className="flex items-center text-xs">
                            {passwordRequirements.uppercase ? (
                              <FaCheck className="text-green-400 mr-2" />
                            ) : (
                              <FaTimes className="text-gray-500 mr-2" />
                            )}
                            <span className={passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-400'}>
                              At least 1 uppercase letter
                            </span>
                          </div>
                          
                          <div className="flex items-center text-xs">
                            {passwordRequirements.lowercase ? (
                              <FaCheck className="text-green-400 mr-2" />
                            ) : (
                              <FaTimes className="text-gray-500 mr-2" />
                            )}
                            <span className={passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-400'}>
                              At least 1 lowercase letter
                            </span>
                          </div>
                          
                          <div className="flex items-center text-xs">
                            {passwordRequirements.number ? (
                              <FaCheck className="text-green-400 mr-2" />
                            ) : (
                              <FaTimes className="text-gray-500 mr-2" />
                            )}
                            <span className={passwordRequirements.number ? 'text-green-400' : 'text-gray-400'}>
                              At least 1 number
                            </span>
                          </div>
                          
                          <div className="flex items-center text-xs">
                            {passwordRequirements.symbol ? (
                              <FaCheck className="text-green-400 mr-2" />
                            ) : (
                              <FaTimes className="text-gray-500 mr-2" />
                            )}
                            <span className={passwordRequirements.symbol ? 'text-green-400' : 'text-gray-400'}>
                              At least 1 symbol
                            </span>
                          </div>
                        </div>
                        
                        {/* Password strength indicator */}
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                          <motion.div 
                            className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          ></motion.div>
                        </div>
                      </div>
                    )}
                    
                    {fieldErrors.password && (
                      <motion.p 
                        className="mt-1 text-xs text-red-400 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationCircle className="mr-1" /> {fieldErrors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Confirm Password field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input 
                        name="confirmPassword"
                        value={formData.confirmPassword} 
                        onChange={handleInputChange} 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className={`w-full bg-gray-900 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-orange-500 transition-colors`} 
                        required 
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="text-gray-400 hover:text-gray-300" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <motion.p 
                        className="mt-1 text-xs text-red-400 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationCircle className="mr-1" /> {fieldErrors.confirmPassword}
                      </motion.p>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Step 4: Terms and Conditions */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
                  
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-300 mb-2">
                      By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </p>
                    <p className="text-sm text-gray-300 mb-2">
                      SpendSync is a platform for tracking expenses and sharing spending moments with friends.
                    </p>
                    <p className="text-sm text-gray-300">
                      We respect your privacy and will never share your personal information without your consent.
                    </p>
                  </div>
                  
                  {/* Terms and conditions checkbox */}
                  <motion.div className="flex items-start" variants={itemVariants}>
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 bg-gray-900 border-gray-600 rounded focus:ring-orange-500 focus:ring-opacity-25 text-orange-500 mt-0.5"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                      I agree to the <a href="/terms" className="text-orange-400 hover:text-orange-300 transition-colors">Terms of Service</a> and <a href="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors">Privacy Policy</a>
                    </label>
                  </motion.div>
                  
                  {fieldErrors.terms && (
                    <motion.p 
                      className="text-xs text-red-400 flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <FaExclamationCircle className="mr-1" /> {fieldErrors.terms}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <motion.button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 1 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                variants={buttonVariants}
                whileHover={currentStep !== 1 ? "hover" : ""}
                whileTap={currentStep !== 1 ? "tap" : ""}
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </motion.button>

              {currentStep < steps.length ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Next
                  <FaArrowRight className="ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex items-center bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400">Or sign up with</span>
            </div>
          </div>

          {/* Google sign-up button */}
          <motion.button 
            onClick={handleGoogle} 
            disabled={loading} 
            className="w-full border border-gray-600 hover:border-gray-500 disabled:opacity-60 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaGoogle className="mr-2" />
            {loading ? 'Connecting...' : 'Continue with Google'}
          </motion.button>

          {/* Log in link */}
          <p className="text-sm text-gray-400 mt-6 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">Log in</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUp