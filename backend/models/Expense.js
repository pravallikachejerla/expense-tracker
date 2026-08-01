const mongoose = require('mongoose');

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Debt', 'Savings', 'Other'
];

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: categories
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
    default: 'Other'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
