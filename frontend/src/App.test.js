import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import axios from 'axios';

// All mocks MUST be declared BEFORE any imports that reference them (Jest hoisting)
jest.mock('axios');
jest.mock('./context/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}));
jest.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="pie-chart">Pie Chart Mock</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart Mock</div>,
}));
jest.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="recharts-pie">{children}</div>,
  Pie: () => <div>Pie Mock</div>,
  Cell: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
}));

import App from './App';
import * as AuthContext from './context/AuthContext';

const mockLogout = jest.fn();
const mockUser = { username: 'testuser' };

describe('Expense Tracker App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AuthContext.useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      logout: mockLogout,
    });

    // Mock URL APIs used by CSV export (jsdom does not implement them)
    if (typeof window.URL.createObjectURL === 'undefined') {
      Object.defineProperty(window.URL, 'createObjectURL', {
        value: jest.fn(() => 'mock-blob-url'),
        writable: true,
      });
    }
    if (typeof window.URL.revokeObjectURL === 'undefined') {
      Object.defineProperty(window.URL, 'revokeObjectURL', {
        value: jest.fn(),
        writable: true,
      });
    }

    // Mock all API calls used by App, AddExpenseModal, BudgetManager, ExpenseList, Summary, hooks, and new features (recurring + CSV export)
    axios.get.mockImplementation((url) => {
      if (url.includes('/expenses/categories') || url.includes('/categories')) {
        return Promise.resolve({ data: ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment'] });
      }
      if (url.includes('/api/expenses') || url.includes('/expenses')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/budgets')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/expenses/export')) {
        return Promise.resolve({ 
          data: new Blob(['id,amount,category,date\n1,50,Food,2024-01-01'], { type: 'text/csv' }) 
        });
      }
      return Promise.resolve({ data: {} });
    });

    axios.post.mockResolvedValue({ data: { _id: 'new1', amount: 100, category: 'Food', isRecurring: false, frequency: 'monthly' } });
    axios.delete.mockResolvedValue({ data: {} });
  });

  test('renders without crashing and displays core UI including new features', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Expense Tracker - testuser')).toBeInTheDocument();
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByText('Budget Manager')).toBeInTheDocument();
    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
    expect(screen.getByText('Recurring Expense')).toBeInTheDocument();
  });

  test('Export CSV button triggers API call for new export functionality', async () => {
    render(<App />);

    const exportButton = await screen.findByText('Export CSV');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/expenses/export'),
        expect.objectContaining({ responseType: 'blob' })
      );
    });
  });

  test('renders recurring expense toggle and frequency controls for new recurring feature', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Recurring Expense')).toBeInTheDocument();
    });
  });

  test('BudgetManager loads without errors using mocked categories and budgets', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Budget Manager')).toBeInTheDocument();
      expect(screen.getByText('No budgets set yet. Add one above.')).toBeInTheDocument();
    });
  });

  test('logout button calls logout from context', async () => {
    render(<App />);

    const logoutButton = await screen.findByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
