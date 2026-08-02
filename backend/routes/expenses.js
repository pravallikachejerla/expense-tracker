const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const { CATEGORIES, PAYMENT_METHODS, FREQUENCIES } = require('../constants');

// Helper: validate category (centralized, improves maintainability)
const validateCategory = (category, res) => {
  if (!CATEGORIES.includes(category)) {
    res.status(400).json({ message: 'Invalid category. Must be one of the standard categories.' });
    return false;
  }
  return true;
};

// Helper: build CSV row (extracted for readability; no behavior change)
const buildCSVRow = (exp) => {
  return [
    new Date(exp.date).toISOString().split('T')[0],
    exp.amount,
    `"${exp.category}"`,
    `"${(exp.description || '').replace(/"/g, '""')}"`,
    `"${exp.paymentMethod || 'Other'}"`,
    exp.isRecurring ? 'Yes' : 'No',
    `"${exp.frequency || 'none'}"`,
    exp.nextOccurrence ? new Date(exp.nextOccurrence).toISOString().split('T')[0] : ''
  ].join(',');
};

// Get all expenses for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recurring expenses
router.get('/recurring', auth, async (req, res) => {
  try {
    const recurringExpenses = await Expense.find({ 
      user: req.user.id, 
      isRecurring: true,
      nextOccurrence: { $gte: new Date() }
    }).sort({ nextOccurrence: 1 });
    res.json(recurringExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get categories (for frontend consistency)
router.get('/categories', auth, (req, res) => {
  res.json(CATEGORIES);
});

// Export expenses as CSV (user-scoped)
router.get('/export', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    
    if (expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses to export' });
    }

    const headers = ['Date', 'Amount', 'Category', 'Description', 'Payment Method', 'Recurring', 'Frequency', 'Next Occurrence'];
    let csv = headers.join(',') + '\n';
    
    expenses.forEach(exp => {
      csv += buildCSVRow(exp) + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new expense
router.post('/', auth, async (req, res) => {
  const { amount, category, description, date, paymentMethod, isRecurring, frequency, nextOccurrence } = req.body;
  
  if (!validateCategory(category, res)) return;
  
  const expense = new Expense({
    amount: parseFloat(amount),
    category,
    description,
    date: date || Date.now(),
    paymentMethod: paymentMethod || 'Other',
    isRecurring: isRecurring || false,
    frequency: frequency || 'none',
    nextOccurrence: nextOccurrence || null,
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

    if (req.body.category && !validateCategory(req.body.category, res)) return;

    if (req.body.amount) expense.amount = parseFloat(req.body.amount);
    if (req.body.category) expense.category = req.body.category;
    if (req.body.description) expense.description = req.body.description;
    if (req.body.date) expense.date = req.body.date;
    if (req.body.paymentMethod) expense.paymentMethod = req.body.paymentMethod;
    if (req.body.isRecurring !== undefined) expense.isRecurring = req.body.isRecurring;
    if (req.body.frequency) expense.frequency = req.body.frequency;
    if (req.body.nextOccurrence) expense.nextOccurrence = req.body.nextOccurrence;

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
