import express from 'express';
import { validationResult, body } from 'express-validator';
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  likeExpense,
  commentOnExpense,
  getExpenseComments
} from '../services/expenseService.js';
import { requireAuth } from '../middleware/auth.js';
import { notFound, errorHandler } from '../middleware/error.js';

const router = express.Router();

// Get all expenses
router.get('/', requireAuth, async (req, res) => {
  try {
    const { startDate, endDate, category, limit = 10, page = 1 } = req.query;

    const filter = {};
    filter.userId = req.userId; // Only get user's own expenses

    if (startDate) filter.startDate = new Date(startDate);
    if (endDate) filter.endDate = new Date(endDate);
    if (category) filter.category = category;

    const expenses = await getExpenses(filter);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page,
        limit,
        total: expenses.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses'
    });
  }
});

// Add new expense
router.post('/', requireAuth, async (req, res) => {
  try {
    const expenseData = { ...req.body, userId: req.userId };
    const expense = await addExpense(expenseData);
    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add expense'
    });
  }
});

// Update expense
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const expense = await updateExpense(id, updateData, req.userId);
    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update expense'
    });
  }
});

// Delete expense
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteExpense(id, req.userId);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete expense'
    });
  }
});

// Like expense
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await likeExpense(id, req.userId);
    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to like expense'
    });
  }
});

// Comment on expense
router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await commentOnExpense(id, { text, userId: req.userId });
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

// Get expense comments
router.get('/:id/comments', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await getExpenseComments(id);
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
});

export default router;