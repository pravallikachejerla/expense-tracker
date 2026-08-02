const { CATEGORIES, PAYMENT_METHODS, FREQUENCIES } = require('../constants');

/**
 * Validates if a category is in the allowed list.
 * @param {string} category - Category to validate
 * @param {object} res - Express response object (for error response)
 * @returns {boolean} true if valid, false otherwise
 */
const validateCategory = (category, res = null) => {
  if (!CATEGORIES.includes(category)) {
    if (res) {
      res.status(400).json({ 
        message: 'Invalid category. Must be one of the standard categories.' 
      });
    }
    return false;
  }
  return true;
};

/**
 * Validates payment method.
 * @param {string} method - Payment method to validate
 * @returns {boolean}
 */
const validatePaymentMethod = (method) => {
  return PAYMENT_METHODS.includes(method || 'Other');
};

/**
 * Validates frequency for recurring expenses.
 * @param {string} frequency - Frequency to validate
 * @returns {boolean}
 */
const validateFrequency = (frequency) => {
  return FREQUENCIES.includes(frequency || 'none');
};

/**
 * Sanitizes and validates expense input data.
 * Throws or returns cleaned data.
 */
const sanitizeExpenseInput = (data) => {
  return {
    amount: parseFloat(data.amount) || 0,
    category: data.category?.trim(),
    description: data.description?.trim(),
    date: data.date || Date.now(),
    paymentMethod: data.paymentMethod || 'Other',
    isRecurring: !!data.isRecurring,
    frequency: data.frequency || 'none',
    nextOccurrence: data.nextOccurrence || null,
  };
};

module.exports = {
  validateCategory,
  validatePaymentMethod,
  validateFrequency,
  sanitizeExpenseInput,
  CATEGORIES, // re-export for convenience
  PAYMENT_METHODS,
  FREQUENCIES
};
