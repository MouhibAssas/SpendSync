import SocialFeed from '../models/SocialFeed.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Expense from '../models/Expense.js';

// Get feed posts
export const getFeedPosts = async ({ limit = 10, page = 1, userId }) => {
  try {
    const skip = (page - 1) * limit;

    // Get user's friends list
    const user = await User.findById(userId).select('friends');
    const friendIds = user?.friends || [];

    // Get posts from user and friends
    const posts = await SocialFeed.find({
      $or: [
        { userId }, // User's own posts
        { userId: { $in: friendIds }, visibility: { $in: ['public', 'friends'] } }, // Friends' posts
        { visibility: 'public' } // Public posts from non-friends
      ]
    })
    .populate('userId', 'username fullName profilePhoto')
    .populate('expenseId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    return posts;
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    throw error;
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    const { userId, expenseId, visibility = 'public' } = postData;

    // Verify the expense belongs to the user and is public
    const expense = await Expense.findOne({ _id: expenseId, userId, isPublic: true });
    if (!expense) {
      throw new Error('Expense not found or not public');
    }

    const post = new SocialFeed({
      userId,
      expenseId,
      visibility
    });

    await post.save();
    await post.populate('userId', 'username fullName profilePhoto');
    await post.populate('expenseId');

    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Like a post
export const likePost = async (id, userId) => {
  try {
    const post = await SocialFeed.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    const likeIndex = post.likes ? post.likes.indexOf(userId) : -1;

    if (likeIndex > -1) {
      // User already liked, so unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked, so add like
      if (!post.likes) post.likes = [];
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('userId', 'username fullName profilePhoto');
    await post.populate('expenseId');

    return post;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Comment on post
export const commentOnPost = async (id, commentData) => {
  try {
    const post = await SocialFeed.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    const comment = new Comment({
      feedId: id,
      userId: commentData.userId,
      text: commentData.text
    });

    await comment.save();
    return comment;
  } catch (error) {
    console.error('Error commenting on post:', error);
    throw error;
  }
};

// Get post comments
export const getPostComments = async (id) => {
  try {
    const comments = await Comment.find({ feedId: id })
      .populate('userId', 'username fullName profilePhoto')
      .sort({ createdAt: -1 });

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};