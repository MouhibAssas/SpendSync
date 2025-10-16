import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle, FaUser } from 'react-icons/fa'
import toast from 'react-hot-toast'

function Login() {
    const { login, googleLogin } = useAuth()
    const navigate = useNavigate()
    const [identifier, setIdentifier] = useState('') // Changed from email to identifier
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [identifierError, setIdentifierError] = useState('') // Changed from emailError
    const [passwordError, setPasswordError] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Validate email format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    // Check if input is email or username
    const isEmail = (input) => {
        return validateEmail(input)
    }

    // Handle identifier change with validation
    const handleIdentifierChange = (e) => {
        const value = e.target.value
        setIdentifier(value)
        
        // Clear error when user starts typing
        if (identifierError) {
            setIdentifierError('')
        }
    }

    // Handle password change with validation
    const handlePasswordChange = (e) => {
        const value = e.target.value
        setPassword(value)
        if (value && value.length < 6) {
            setPasswordError('Password must be at least 6 characters')
        } else {
            setPasswordError('')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setIdentifierError('')
        setPasswordError('')
        
        // Validate before submission
        if (!identifier.trim()) {
            setIdentifierError('Please enter your email or username')
            return
        }
        
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters')
            return
        }
        
        setLoading(true)
        try {
            await login(identifier, password)
            setSuccessMessage('Login successful! Redirecting...')
            toast.success('Logged in successfully')
            setTimeout(() => {
                navigate('/dashboard')
            }, 1000)
        } catch (err) {
            setError('Invalid credentials. Please check your email/username and password.')
            toast.error('Login failed')
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogle() {
        setError('')
        setLoading(true)
        try {
            await googleLogin()
            setSuccessMessage('Login successful! Redirecting...')
            toast.success('Logged in with Google')
            setTimeout(() => {
                navigate('/dashboard')
            }, 1000)
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
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to your SpendSync account</p>
                </motion.div>

                {/* Login form card */}
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email/Username field */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email or Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {isEmail(identifier) ? (
                                        <FaEnvelope className="text-gray-400" />
                                    ) : (
                                        <FaUser className="text-gray-400" />
                                    )}
                                </div>
                                <input 
                                    value={identifier} 
                                    onChange={handleIdentifierChange} 
                                    type="text" 
                                    placeholder="Enter your email or username" 
                                    className={`w-full bg-gray-900 border ${identifierError ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`} 
                                    required 
                                />
                            </div>
                            {identifierError && (
                                <motion.p 
                                    className="mt-1 text-xs text-red-400 flex items-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <FaExclamationCircle className="mr-1" /> {identifierError}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Password field */}
                        <motion.div variants={itemVariants}>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-300">Password</label>
                                <a href="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input 
                                    value={password} 
                                    onChange={handlePasswordChange} 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    className={`w-full bg-gray-900 border ${passwordError ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-orange-500 transition-colors`} 
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
                            {passwordError && (
                                <motion.p 
                                    className="mt-1 text-xs text-red-400 flex items-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <FaExclamationCircle className="mr-1" /> {passwordError}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Remember me checkbox */}
                        <motion.div className="flex items-center" variants={itemVariants}>
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 bg-gray-900 border-gray-600 rounded focus:ring-orange-500 focus:ring-opacity-25 text-orange-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                Remember me
                            </label>
                        </motion.div>

                        {/* Submit button */}
                        <motion.button 
                            disabled={loading} 
                            type="submit" 
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
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
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-800 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Google login button */}
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

                    {/* Sign up link */}
                    <p className="text-sm text-gray-400 mt-6 text-center">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">Sign up</a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Login