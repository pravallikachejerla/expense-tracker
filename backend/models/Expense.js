const mongoose = require('mongoose');
const { CATEGORIES, PAYMENT_METHODS, FREQUENCIES } = require('../constants');

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORIES
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
    enum: PAYMENT_METHODS,
    default: 'Other'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: FREQUENCIES,
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

// Helper to calculate next occurrence (improves readability/maintainability)
const calculateNextOccurrence = (date, frequency) => {
  if (!frequency || frequency === 'none') return null;
  const nextDate = new Date(date);
  if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
  else if (frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
  else if (frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
  return nextDate;
};

// Improved pre-save hook (cleaner, uses helper, no direct mutation side-effects in condition)
ExpenseSchema.pre('save', function(next) {
  if (this.isRecurring && this.frequency !== 'none' && !this.nextOccurrence) {
    this.nextOccurrence = calculateNextOccurrence(this.date, this.frequency);
  }
  next();
});

module.exports = mongoose.model('Expense', ExpenseSchema);
