import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult, body } from 'express-validator';
import { User } from '../models/User';
import { createAccessToken } from '../utils/jwt';
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaEnvelope, 
  FaLock, 
  FaExclamationCircle 
} from 'react-icons/fa';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { username, fullName, email, password, country, currency } = req.body;
    
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ username }, { email }]
      );
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }
      
      // Create new user
      const user = new User({
        username,
        fullName,
        email,
        password,
        country,
        currency,
        profilePhoto: req.body.profilePhoto || ''
      });
      
      // Hash password before saving
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      
      // Create JWT token
      const token = createAccessToken(user._id);
      
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          country: user.country,
          currency: user.currency
        },
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { email, password } = req.body;
    
    try {
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        }
      
      // Compare hashed password
      const isValid = await user.comparePassword(password);
      
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        }
      
      // Create JWT token
      const token = createAccessToken(user._id);
      
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          country: user.country,
          currency: user.currency
        },
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
  }
};

export const googleLogin = async (req, res) => {
  try {
    // Implement Google OAuth2.0
    res.status(200).json({
      success: true,
      message: 'Google login successful'
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Google login failed'
      });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          country: user.country,
          currency: user.currency
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user data'
      });
  }
};

// JWT token creation utility
const createAccessToken = (userId) => {
  return jwt.sign(
    { userId, 
      exp: Math.floor(Date.now() / 0.5) + Math.random() * 1000
    },
    process.env.JWT_SECRET
  );
};