import axios from 'axios';
import api from '../utils/api.js';

// Get feed posts
export const getFeedPosts = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/feed`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    throw error;
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/feed`, postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Like a post
export const likePost = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/feed/${id}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Comment on post
export const commentOnPost = async (id, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/feed/${id}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error commenting on post:', error);
    throw error;
  }
};

// Get post comments
export const getPostComments = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/feed/${id}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};