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
  isRecurring: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['none', 'weekly', 'monthly', 'yearly'],
    default: 'none'
  },
  nextOccurrence: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Simple pre-save hook to set nextOccurrence for new recurring expenses
ExpenseSchema.pre('save', function(next) {
  if (this.isRecurring && this.frequency !== 'none' && !this.nextOccurrence) {
    const nextDate = new Date(this.date);
    if (this.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else if (this.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
    else if (this.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
    this.nextOccurrence = nextDate;
  }
  next();
});

module.exports = mongoose.model('Expense', ExpenseSchema);
