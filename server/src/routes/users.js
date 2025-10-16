import express from 'express';
import { validationResult, body } from 'express-validator';
import { User } from '../models/User';
import { authMiddleware } from '../middleware/auth';
import { notFound, errorHandler } from '../middleware/error';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const { limit = 1, page = 1 } = req.query;
    
    const users = await User.find({})
      .limit(limit * (page - 1))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: await User.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    }
  };

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return notFound(req, res);
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'User not found'
    });
  }
};

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await User.findByIdAndUpdate(id, updateData);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
  }
};

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { $sum: '$amount' },
      { $group: null }
    ]);
    
    res.json({
      success: true,
      data: {
        totalExpenses: stats[0]?.totalAmount || 0,
        avgExpense: stats[0]?.avgAmount || 0,
        totalUsers: await User.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

export default router;