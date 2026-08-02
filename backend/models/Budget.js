const mongoose = require('mongoose');
const { CATEGORIES } = require('../constants');
const { validateCategory } = require('../utils/validators');

/**
 * Budget model with user scoping and performance index.
 * Refactored for consistency with Expense model (static methods, validation).
 */
const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: CATEGORIES
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

// Index for performance on user-scoped budget lookups (common in BudgetManager)
BudgetSchema.index({ user: 1, category: 1 });
BudgetSchema.index({ user: 1, period: 1 });

// Static method for user-scoped queries (maintainability, DRY with Expense)
BudgetSchema.statics.findByUser = function(userId, filter = {}) {
  return this.find({ user: userId, ...filter }).sort({ category: 1 });
};

// Static method to validate and create/update budget
BudgetSchema.statics.validateAndSave = async function(userId, data) {
  if (!validateCategory(data.category)) {
    throw new Error('Invalid category. Must be one of the standard categories.');
  }
  const period = data.period || 'monthly';
  let budget = await this.findOne({ user: userId, category: data.category, period });
  
  if (budget) {
    budget.amount = parseFloat(data.amount);
    if (data.period) budget.period = data.period;
    budget.startDate = Date.now();
  } else {
    budget = new this({
      category: data.category,
      amount: parseFloat(data.amount),
      period,
      user: userId
    });
  }
  return budget.save();
};

module.exports = mongoose.model('Budget', BudgetSchema);
