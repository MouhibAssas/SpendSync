import express from 'express';
import {
  getFeedPosts,
  createPost,
  likePost,
  commentOnPost
} from '../services/feedService.js';
import { requireAuth } from '../middleware/auth.js';
import { notFound, errorHandler } from '../middleware/error.js';

const router = express.Router();

// Get feed posts
router.get('/', requireAuth, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const posts = await getFeedPosts({ limit, page, userId: req.userId });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feed posts'
    });
  }
});

// Create new post
router.post('/', requireAuth, async (req, res) => {
  try {
    const postData = { ...req.body, userId: req.userId };
    const post = await createPost(postData);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

// Like a post
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await likePost(id, req.userId);

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to like post'
    });
  }
});

// Comment on post
router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await commentOnPost(id, { text, userId: req.userId });

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

export default router;