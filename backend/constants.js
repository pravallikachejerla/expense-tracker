const CATEGORIES = [
  'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Debt', 'Savings', 'Other'
];

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

const FREQUENCIES = ['none', 'weekly', 'monthly', 'yearly'];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

module.exports = {
  CATEGORIES,
  PAYMENT_METHODS,
  FREQUENCIES,
  JWT_SECRET
};
