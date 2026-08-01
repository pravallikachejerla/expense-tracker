const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Debt', 'Savings', 'Other'
];

// Get all budgets for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ category: 1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get categories (for frontend consistency)
router.get('/categories', auth, (req, res) => {
  res.json(categories);
});

// Set or update budget for a category (upsert style for simplicity)
router.post('/', auth, async (req, res) => {
  const { category, amount, period } = req.body;
  
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category. Must be one of the standard categories.' });
  }
  
  try {
    let budget = await Budget.findOne({ user: req.user.id, category, period: period || 'monthly' });
    
    if (budget) {
      budget.amount = parseFloat(amount);
      if (period) budget.period = period;
      budget.startDate = Date.now();
      const updatedBudget = await budget.save();
      return res.json(updatedBudget);
    } else {
      budget = new Budget({
        category,
        amount: parseFloat(amount),
        period: period || 'monthly',
        user: req.user.id
      });
      const newBudget = await budget.save();
      return res.status(201).json(newBudget);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete budget
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
