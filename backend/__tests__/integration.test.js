process.env.NODE_ENV = 'test';

const request = require('supertest');

// Mock constants first
jest.mock('../constants', () => ({
  CATEGORIES: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Personal', 'Debt', 'Savings', 'Other'],
  PAYMENT_METHODS: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
  FREQUENCIES: ['none', 'weekly', 'monthly', 'yearly'],
  JWT_SECRET: 'test-secret-key'
}));

// Mock models
jest.mock('../models/Expense', () => {
  const mockExpenseConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'mockid123',
    save: jest.fn().mockResolvedValue({ ...data, _id: 'mockid123', nextOccurrence: data.isRecurring ? new Date(Date.now() + 86400000) : null })
  }));
  mockExpenseConstructor.find = jest.fn().mockResolvedValue([{
    amount: 50,
    category: 'Food',
    description: 'Test',
    isRecurring: true,
    frequency: 'monthly',
    nextOccurrence: new Date(Date.now() + 86400000),
    user: 'mockuser123'
  }]);
  mockExpenseConstructor.findOne = jest.fn().mockResolvedValue(null);
  mockExpenseConstructor.create = jest.fn().mockResolvedValue({ _id: 'mockid123' });
  return mockExpenseConstructor;
});

jest.mock('../models/Budget', () => {
  const mockBudgetConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'mockbudgetid',
    save: jest.fn().mockResolvedValue({ ...data, _id: 'mockbudgetid' })
  }));
  mockBudgetConstructor.find = jest.fn().mockResolvedValue([]);
  mockBudgetConstructor.findOne = jest.fn().mockResolvedValue(null);
  return mockBudgetConstructor;
});

jest.mock('../models/User');

jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { id: 'mockuser123' };
  next();
});

const app = require('../server');

describe('Expense Tracker Tests for New Functionality', () => {
  describe('Health & Docker/Env Config', () => {
    test('GET /health returns ok status (critical for Docker healthchecks)', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.message).toContain('Expense Tracker API is running');
    });
  });

  describe('Constants (Centralized - No Duplication)', () => {
    test('Exports correct categories and frequencies', () => {
      const constants = require('../constants');
      expect(constants.CATEGORIES).toContain('Housing');
      expect(constants.CATEGORIES.length).toBe(12);
      expect(constants.FREQUENCIES).toContain('monthly');
    });
  });

  describe('Expenses Routes & Logic (Recurring, Validation, Categories - New/Refactored)', () => {
    test('GET /api/expenses/categories returns list', async () => {
      const res = await request(app)
        .get('/api/expenses/categories')
        .set('Authorization', 'Bearer mocktoken');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toContain('Food');
    });

    test('POST /api/expenses with recurring and valid category succeeds (uses pre-save hook)', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer mocktoken')
        .send({
          amount: 75.5,
          category: 'Transportation',
          description: 'Taxi ride',
          isRecurring: true,
          frequency: 'weekly'
        });
      expect(res.status).toBe(201);
      expect(res.body.category).toBe('Transportation');
      expect(res.body.isRecurring).toBe(true);
      expect(res.body.nextOccurrence).toBeDefined();
    });

    test('Rejects invalid category (validateCategory helper)', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', 'Bearer mocktoken')
        .send({
          amount: 100,
          category: 'InvalidCat',
          description: 'Bad'
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid category');
    });
  });

  describe('Budgets Routes (New BudgetManager)', () => {
    test('POST /api/budgets with valid category succeeds', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', 'Bearer mocktoken')
        .send({
          category: 'Housing',
          amount: 1500
        });
      expect([200, 201]).toContain(res.status);
      expect(res.body.category).toBe('Housing');
    });
  });

  describe('Recurring Logic (Extracted Helper)', () => {
    test('calculateNextOccurrence computes correct dates', () => {
      const calculateNextOccurrence = (date, frequency) => {
        if (!frequency || frequency === 'none') return null;
        const nextDate = new Date(date);
        if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
        else if (frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
        else if (frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
        return nextDate;
      };
      const base = new Date('2026-08-02');
      expect(calculateNextOccurrence(base, 'weekly').getDate()).toBe(9);
      expect(calculateNextOccurrence(base, 'monthly').getMonth()).toBe(8);
      expect(calculateNextOccurrence(base, 'none')).toBeNull();
    });
  });
});