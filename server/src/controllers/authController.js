import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult, body } from 'express-validator';
import  User  from '../models/User.js';
import { createAccessToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const { username, fullName, email, password, country, currency } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });
    
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
      passwordHash: await User.hashPassword(password),
      country,
      currency,
      profilePhoto: req.body.profilePhoto || ''
    });

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
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Compare hashed password
    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
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
    // User is already authenticated by middleware, req.userId is set
    const user = await User.findById(req.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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
        currency: user.currency,
        profilePhoto: user.profilePhoto,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
};

// Remove unused function

const authController = { register, login, logout, googleLogin, getMe }
export default authController;
