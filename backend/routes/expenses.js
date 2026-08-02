const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const { validateCategory, sanitizeExpenseInput, CATEGORIES } = require('../utils/validators');

// Helper: build CSV row (preserved for readability; no behavior change)
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

// Get all expenses for the authenticated user (uses static method + index for perf)
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.findByUser(req.user.id);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recurring expenses (uses index for efficiency)
router.get('/recurring', auth, async (req, res) => {
  try {
    const recurringExpenses = await Expense.findByUser(req.user.id, {
      isRecurring: true,
      nextOccurrence: { $gte: new Date() }
    });
    res.json(recurringExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get categories (for frontend consistency)
router.get('/categories', auth, (req, res) => {
  res.json(CATEGORIES);
});

// Export expenses as CSV (user-scoped, uses static for query)
router.get('/export', auth, async (req, res) => {
  try {
    const expenses = await Expense.findByUser(req.user.id);
    
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

// Add new expense (uses sanitizer for cleaner input handling)
router.post('/', auth, async (req, res) => {
  if (!validateCategory(req.body.category, res)) return;
  
  const sanitized = sanitizeExpenseInput(req.body);
  const expense = new Expense({
    ...sanitized,
    user: req.user.id
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update expense (only if owned by user; uses model method for update logic)
router.patch('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    if (req.body.category && !validateCategory(req.body.category, res)) return;

    expense.updateFromInput(req.body);  // uses sanitized update + recurring logic
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
