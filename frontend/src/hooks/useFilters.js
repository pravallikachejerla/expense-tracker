import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for expense filtering logic.
 * Extracted from App.js to improve readability and performance (useMemo prevents
 * unnecessary recalculations on every render). Pure computation, no side effects.
 */
const useFilters = (expenses) => {
  const [filter, setFilter] = useState({
    period: 'all',
    startDate: '',
    endDate: '',
    category: '',
    minAmount: '',
    maxAmount: ''
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const startDate = filter.startDate ? new Date(filter.startDate) : null;
      const endDate = filter.endDate ? new Date(filter.endDate) : null;

      if (filter.period === 'month') {
        const now = new Date();
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
      } else if (filter.period === 'year') {
        const now = new Date();
        return expenseDate.getFullYear() === now.getFullYear();
      } else if (filter.period === 'custom') {
        return (!startDate || expenseDate >= startDate) && 
               (!endDate || expenseDate <= endDate);
      }

      return (
        (!filter.category || expense.category.toLowerCase().includes(filter.category.toLowerCase())) &&
        (!filter.minAmount || expense.amount >= parseFloat(filter.minAmount)) &&
        (!filter.maxAmount || expense.amount <= parseFloat(filter.maxAmount))
      );
    });
  }, [expenses, filter]);

  const updateFilter = useCallback((newFilter) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const resetFilter = useCallback(() => {
    setFilter({
      period: 'all',
      startDate: '',
      endDate: '',
      category: '',
      minAmount: '',
      maxAmount: ''
    });
  }, []);

  return {
    filter,
    filteredExpenses,
    updateFilter,
    resetFilter,
    setFilter // for backward compatibility with ExpenseFilter component
  };
};

export default useFilters;
