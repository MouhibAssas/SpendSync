import express from 'express';
import { validationResult, body } from 'express-validator';
import  User  from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { notFound, errorHandler } from '../middleware/error.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const users = await User.find({})
      .skip((page - 1) * limit)
      .limit(limit)
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
    });
  }
});

// Get user by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-passwordHash');

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
});

// Update user profile
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user can only update their own profile
    if (id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this profile'
      });
    }

    const updateData = req.body;
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.passwordHash;
    delete updateData.email;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');

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
});

// Delete user
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user can only delete their own account
    if (id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this account'
      });
    }

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
});

// Search users
router.get('/search', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } }
      ]
    }).select('username fullName profilePhoto').limit(10);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
});

// Follow user
router.post('/:id/follow', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId;

    if (id === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
    }

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!currentUser.following.includes(id)) {
      currentUser.following.push(id);
      userToFollow.followers.push(currentUserId);
      await currentUser.save();
      await userToFollow.save();
    }

    res.json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to follow user'
    });
  }
});

// Unfollow user
router.delete('/:id/follow', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId;

    const userToUnfollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    currentUser.following = currentUser.following.filter(followId => followId.toString() !== id);
    userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId.toString() !== currentUserId);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unfollow user'
    });
  }
});

// Get user followers
router.get('/:id/followers', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('followers', 'username fullName profilePhoto');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.followers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch followers'
    });
  }
});

// Get user following
router.get('/:id/following', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('following', 'username fullName profilePhoto');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.following
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch following'
    });
  }
});

export default router;