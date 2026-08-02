const { validateCategory, validatePaymentMethod, validateFrequency, sanitizeExpenseInput } = require('../../utils/validators');

describe('Validators (for new standardized categories, recurring, input sanitization)', () => {
  describe('validateCategory', () => {
    test('returns true for valid standard category', () => {
      expect(validateCategory('Food')).toBe(true);
      expect(validateCategory('Housing')).toBe(true);
    });

    test('returns false for invalid category', () => {
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      expect(validateCategory('InvalidCat', mockRes)).toBe(false);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validatePaymentMethod and validateFrequency', () => {
    test('validates payment methods', () => {
      expect(validatePaymentMethod('Credit Card')).toBe(true);
      expect(validatePaymentMethod('Invalid')).toBe(false);
      expect(validatePaymentMethod()).toBe(true); // defaults to Other
    });

    test('validates frequencies for recurring expenses', () => {
      expect(validateFrequency('monthly')).toBe(true);
      expect(validateFrequency('none')).toBe(true);
      expect(validateFrequency('invalid')).toBe(false);
    });
  });

  describe('sanitizeExpenseInput', () => {
    test('sanitizes and defaults values for new expense fields', () => {
      const input = {
        amount: '75.5',
        category: '  Food  ',
        description: 'Test   ',
        isRecurring: true,
        frequency: 'monthly'
      };
      const sanitized = sanitizeExpenseInput(input);
      expect(sanitized.amount).toBe(75.5);
      expect(sanitized.category).toBe('Food');
      expect(sanitized.description).toBe('Test');
      expect(sanitized.isRecurring).toBe(true);
      expect(sanitized.frequency).toBe('monthly');
      expect(sanitized.paymentMethod).toBe('Other');
    });
  });
});
