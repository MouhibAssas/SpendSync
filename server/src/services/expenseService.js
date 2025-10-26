import Expense from '../models/Expense.js';
import Comment from '../models/Comment.js';

/**
 * Get expenses with optional filters
 * @param {Object} filter - Filter object containing startDate, endDate, category
 * @returns {Promise<Array>} Array of expenses
 */
export const getExpenses = async (filter) => {
  const query = {};
  
  if (filter.startDate || filter.endDate) {
    query.createdAt = {};
    if (filter.startDate) query.createdAt.$gte = filter.startDate;
    if (filter.endDate) query.createdAt.$lte = filter.endDate;
  }
  
  if (filter.category) {
    query.category = filter.category;
  }
  
  const expenses = await Expense.find(query).sort({ createdAt: -1 });
  return expenses;
};

/**
 * Add a new expense
 * @param {Object} expenseData - Expense data to create
 * @returns {Promise<Object>} Created expense
 */
export const addExpense = async (expenseData) => {
  const expense = new Expense(expenseData);
  await expense.save();
  return expense;
};

/**
 * Update an existing expense
 * @param {String} id - Expense ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - User ID for ownership verification
 * @returns {Promise<Object>} Updated expense
 */
export const updateExpense = async (id, updateData, userId) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: id, userId }, // Ensure user owns the expense
    updateData,
    { new: true }
  );
  if (!expense) {
    throw new Error('Expense not found or unauthorized');
  }
  return expense;
};

/**
 * Delete an expense
 * @param {String} id - Expense ID
 * @param {String} userId - User ID for ownership verification
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id, userId) => {
  const expense = await Expense.findOneAndDelete({ _id: id, userId });
  if (!expense) {
    throw new Error('Expense not found or unauthorized');
  }
};

/**
 * Like an expense (toggle like functionality)
 * @param {String} id - Expense ID
 * @param {String} userId - User ID who is liking
 * @returns {Promise<Object>} Updated expense
 */
export const likeExpense = async (id, userId) => {
  const expense = await Expense.findById(id);
  if (!expense) {
    throw new Error('Expense not found');
  }

  // Check if user already liked this expense
  const likeIndex = expense.likes ? expense.likes.indexOf(userId) : -1;

  if (likeIndex > -1) {
    // User already liked, so unlike
    expense.likes.splice(likeIndex, 1);
  } else {
    // User hasn't liked, so add like
    if (!expense.likes) expense.likes = [];
    expense.likes.push(userId);
  }

  await expense.save();
  return expense;
};

/**
 * Add a comment to an expense
 * @param {String} id - Expense ID
 * @param {Object} commentData - Comment data containing text and userId
 * @returns {Promise<Object>} Created comment
 */
export const commentOnExpense = async (id, commentData) => {
  // First verify the expense exists
  const expense = await Expense.findById(id);
  if (!expense) {
    throw new Error('Expense not found');
  }

  const comment = new Comment({
    feedId: id, // This should reference the expense ID for comments on expenses
    userId: commentData.userId,
    text: commentData.text
  });
  await comment.save();
  return comment;
};

/**
 * Get all comments for an expense
 * @param {String} id - Expense ID
 * @returns {Promise<Array>} Array of comments
 */
export const getExpenseComments = async (id) => {
  const comments = await Comment.find({ feedId: id }).sort({ createdAt: -1 });
  return comments;
};
