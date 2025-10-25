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
 * @returns {Promise<Object>} Updated expense
 */
export const updateExpense = async (id, updateData) => {
  const expense = await Expense.findByIdAndUpdate(id, updateData, { new: true });
  return expense;
};

/**
 * Delete an expense
 * @param {String} id - Expense ID
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id) => {
  await Expense.findByIdAndDelete(id);
};

/**
 * Like an expense (toggle like functionality)
 * @param {String} id - Expense ID
 * @returns {Promise<Object>} Updated expense
 */
export const likeExpense = async (id) => {
  // TODO: Implement like functionality with user tracking
  // For now, just return the expense
  const expense = await Expense.findById(id);
  return expense;
};

/**
 * Add a comment to an expense
 * @param {String} id - Expense ID
 * @param {Object} commentData - Comment data containing text
 * @returns {Promise<Object>} Created comment
 */
export const commentOnExpense = async (id, commentData) => {
  const comment = new Comment({
    feedId: id,
    ...commentData
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
