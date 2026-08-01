const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Debt', 'Savings', 'Other'
];

// Get all expenses for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get categories (for frontend consistency)
router.get('/categories', auth, (req, res) => {
  res.json(categories);
});

// Export expenses as CSV (user-scoped)
router.get('/export', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    
    if (expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses to export' });
    }

    // Build CSV manually (no extra deps)
    const headers = ['Date', 'Amount', 'Category', 'Description', 'Payment Method'];
    let csv = headers.join(',') + '\n';
    
    expenses.forEach(exp => {
      const row = [
        new Date(exp.date).toISOString().split('T')[0],
        exp.amount,
        `"${exp.category}"`,  // quote to handle commas if any
        `"${(exp.description || '').replace(/"/g, '""')}"`,
        `"${exp.paymentMethod || 'Other'}"`
      ];
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new expense for the authenticated user
router.post('/', auth, async (req, res) => {
  const { amount, category, description, date, paymentMethod } = req.body;
  
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category. Must be one of the standard categories.' });
  }
  
  const expense = new Expense({
    amount: parseFloat(amount),
    category,
    description,
    date: date || Date.now(),
    paymentMethod: paymentMethod || 'Other',
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

    if (req.body.category && !categories.includes(req.body.category)) {
      return res.status(400).json({ message: 'Invalid category. Must be one of the standard categories.' });
    }

    if (req.body.amount) expense.amount = parseFloat(req.body.amount);
    if (req.body.category) expense.category = req.body.category;
    if (req.body.description) expense.description = req.body.description;
    if (req.body.date) expense.date = req.body.date;
    if (req.body.paymentMethod) expense.paymentMethod = req.body.paymentMethod;

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
