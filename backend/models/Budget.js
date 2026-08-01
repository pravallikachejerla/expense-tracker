const mongoose = require('mongoose');

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Debt', 'Savings', 'Other'
];

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: categories
  },
  amount: {
    type: Number,
    required: true
  },
  period: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Budget', BudgetSchema);
