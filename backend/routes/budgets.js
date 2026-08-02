const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');
const { CATEGORIES } = require('../utils/validators');

// Get all budgets for the authenticated user (uses static + index)
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.findByUser(req.user.id);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get categories (for frontend consistency)
router.get('/categories', auth, (req, res) => {
  res.json(CATEGORIES);
});

// Set or update budget (uses model static for validation, upsert logic, cleaner route)
router.post('/', auth, async (req, res) => {
  try {
    const savedBudget = await Budget.validateAndSave(req.user.id, req.body);
    const status = savedBudget.isNew ? 201 : 200;
    res.status(status).json(savedBudget);
  } catch (err) {
    const status = err.message.includes('Invalid category') ? 400 : 400;
    res.status(status).json({ message: err.message });
  }
});

// Delete budget (user-scoped)
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
