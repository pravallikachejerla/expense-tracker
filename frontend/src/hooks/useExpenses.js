import { useState, useEffect, useCallback } from 'react';
import { expenseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for expense-related data and operations.
 * Extracted from monolithic App.js for better readability, single responsibility,
 * reusability across components, and easier testing/maintenance.
 * Uses centralized api service. Preserves all original behavior.
 */
const useExpenses = () => {
  const { logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportMessage, setExportMessage] = useState('');

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseAPI.getAll();
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.response?.data?.message || 'Failed to fetch expenses');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const addExpense = useCallback(async (expenseData) => {
    try {
      const response = await expenseAPI.create(expenseData);
      setExpenses(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id, updateData) => {
    try {
      const response = await expenseAPI.update(id, updateData);
      setExpenses(prev => prev.map(exp => exp._id === id ? response.data : exp));
      return response.data;
    } catch (err) {
      console.error('Error updating expense:', err);
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      await expenseAPI.delete(id);
      setExpenses(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      if (err.response?.status === 401) logout();
      throw err;
    }
  }, [logout]);

  const exportExpenses = useCallback(async () => {
    try {
      const response = await expenseAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setExportMessage('CSV exported successfully!');
      setTimeout(() => setExportMessage(''), 3000);
      return true;
    } catch (err) {
      console.error('Export error:', err);
      setExportMessage('Failed to export CSV. No expenses found or server error.');
      setTimeout(() => setExportMessage(''), 4000);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    exportExpenses,
    exportMessage,
    setExportMessage,
  };
};

export default useExpenses;
