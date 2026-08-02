import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');
axios.get = jest.fn().mockResolvedValue({ data: [] });
axios.post = jest.fn().mockResolvedValue({ data: {} });
axios.delete = jest.fn().mockResolvedValue({ data: {} });

// Mock AuthContext
jest.mock('./context/AuthContext', () => ({
  useAuth: () => ({ 
    user: { username: 'testuser' }, 
    loading: false, 
    logout: jest.fn() 
  }),
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>
}));

// Mock chart libraries (jsdom doesn't support canvas/getContext)
jest.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="pie-chart">Pie Chart Mock</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart Mock</div>
}));
jest.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="recharts-pie">{children}</div>,
  Pie: () => <div>Pie Mock</div>,
  Cell: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>
}));



test('app smoke test - renders without crashing', () => {
  expect(() => render(<App />)).not.toThrow();
});
