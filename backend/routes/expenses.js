const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get all expenses for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new expense for the authenticated user
router.post('/', auth, async (req, res) => {
  const expense = new Expense({
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description,
    date: req.body.date,
    user: req.user.id
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update expense (only if owned by user)
router.patch('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    if (req.body.amount) expense.amount = req.body.amount;
    if (req.body.category) expense.category = req.body.category;
    if (req.body.description) expense.description = req.body.description;
    if (req.body.date) expense.date = req.body.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete expense (only if owned by user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
