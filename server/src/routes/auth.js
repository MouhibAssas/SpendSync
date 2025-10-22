import express from 'express';
import { validationResult, body } from 'express-validator';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', [
  body('username').notEmpty().withMessage('Username is required').matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email').isEmail().withMessage('Please include @ in your email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR', 'TND']),
  body('profilePhoto').optional()
], 
  authController.register
);

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Please include @ in your email'),
  body('password').exists().withMessage('Password is required'),
  body('rememberMe').optional()
], 
  authController.login
);

// Google OAuth
router.post('/google', authController.googleLogin);

// Logout
router.post('/logout', authController.logout);

// Get current user
router.get('/me', authMiddleware, authController.getMe);

export default router;