const mongoose = require('mongoose');
const { CATEGORIES } = require('../constants');

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

module.exports = mongoose.model('Budget', BudgetSchema);
