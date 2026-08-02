const mongoose = require('mongoose');
const { CATEGORIES, PAYMENT_METHODS, FREQUENCIES } = require('../constants');
const { validateFrequency, sanitizeExpenseInput } = require('../utils/validators');

/**
 * Expense model with recurring logic, user scoping, and performance indexes.
 * Refactored for maintainability: static methods, sanitized updates, indexes.
 */
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

// Compound indexes for performance on common queries (user-scoped, date ranges, recurring lookups)
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });
ExpenseSchema.index({ user: 1, isRecurring: 1, nextOccurrence: 1 });

// Static method to find expenses by user (centralizes scoping, used in routes for consistency)
ExpenseSchema.statics.findByUser = function(userId, filter = {}) {
  return this.find({ user: userId, ...filter }).sort({ date: -1 });
};

// Static helper for next occurrence calculation (validated, reusable across model and tests)
ExpenseSchema.statics.calculateNextOccurrence = (date, frequency) => {
  if (!validateFrequency(frequency) || frequency === 'none') return null;
  const nextDate = new Date(date);
  if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
  else if (frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
  else if (frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
  return nextDate;
};

// Instance method for safe, sanitized updates from API input (improves maintainability, reduces duplication in routes)
ExpenseSchema.methods.updateFromInput = function(inputData) {
  const sanitized = sanitizeExpenseInput(inputData);
  Object.assign(this, sanitized);
  if (this.isRecurring && this.frequency !== 'none' && !this.nextOccurrence) {
    this.nextOccurrence = ExpenseSchema.statics.calculateNextOccurrence(this.date, this.frequency);
  }
  return this;
};

// Pre-save hook for recurring expenses (preserves original behavior exactly)
ExpenseSchema.pre('save', function(next) {
  if (this.isRecurring && this.frequency !== 'none' && !this.nextOccurrence) {
    this.nextOccurrence = ExpenseSchema.statics.calculateNextOccurrence(this.date, this.frequency);
  }
  next();
});

module.exports = mongoose.model('Expense', ExpenseSchema);
