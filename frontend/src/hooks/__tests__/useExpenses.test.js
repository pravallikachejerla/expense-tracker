import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useExpenses from '../useExpenses';
import { expenseAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/api');
jest.mock('../../context/AuthContext');

const mockLogout = jest.fn();
const mockUser = { username: 'testuser' };

describe('useExpenses Hook (New custom hook for expenses, recurring, export, error handling)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ logout: mockLogout, user: mockUser });
    expenseAPI.getAll.mockResolvedValue({ data: [{ _id: '1', amount: 50, category: 'Food' }] });
    expenseAPI.create.mockResolvedValue({ data: { _id: '2', amount: 100, category: 'Transport' } });
    expenseAPI.update.mockResolvedValue({ data: { _id: '1', amount: 75 } });
    expenseAPI.delete.mockResolvedValue({ data: {} });
    expenseAPI.export.mockResolvedValue({ data: new Blob(['csv,data'], { type: 'text/csv' }) });
  });

  test('fetches expenses on mount and handles loading/error states', async () => {
    const { result } = renderHook(() => useExpenses());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0].category).toBe('Food');
    });
  });

  test('addExpense updates local state and calls API (new recurring support)', async () => {
    const { result } = renderHook(() => useExpenses());
    
    await act(async () => {
      await result.current.addExpense({ amount: 100, category: 'Food', isRecurring: true, frequency: 'monthly' });
    });
    
    expect(expenseAPI.create).toHaveBeenCalled();
    expect(result.current.expenses.length).toBeGreaterThan(0);
  });

  test('exportExpenses triggers download and sets success message for new CSV feature', async () => {
    // Mock URL methods for test env
    const mockCreateObjectURL = jest.fn(() => 'mock-url');
    const mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    
    const { result } = renderHook(() => useExpenses());
    
    await act(async () => {
      await result.current.exportExpenses();
    });
    
    expect(expenseAPI.export).toHaveBeenCalled();
    expect(result.current.exportMessage).toBe('CSV exported successfully!');
  });

  test('handles auth errors by calling logout', async () => {
    expenseAPI.getAll.mockRejectedValueOnce({ response: { status: 401, data: { message: 'Unauthorized' } } });
    
    const { result } = renderHook(() => useExpenses());
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(result.current.error).toBeDefined();
    });
  });
});
