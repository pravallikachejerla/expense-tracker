import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import AddExpenseForm from './components/AddExpenseModal';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseFilter from './components/ExpenseFilter';
import EditExpenseModal from './components/EditExpenseModal';
import ExpenseChart from './components/ExpenseChart';
import './App.css'; 

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState({
    period: 'all',
    startDate: '',
    endDate: '',
    category: '',
    minAmount: '',
    maxAmount: ''
  });
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filterExpenses = useCallback(() => {
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const startDate = filter.startDate ? new Date(filter.startDate) : null;
      const endDate = filter.endDate ? new Date(filter.endDate) : null;

      if (filter.period === 'month') {
        const now = new Date();
        return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
      } else if (filter.period === 'year') {
        const now = new Date();
        return expenseDate.getFullYear() === now.getFullYear();
      } else if (filter.period === 'custom') {
        return (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate);
      }

      return (
        (!filter.category || expense.category.toLowerCase().includes(filter.category.toLowerCase())) &&
        (!filter.minAmount || expense.amount >= parseFloat(filter.minAmount)) &&
        (!filter.maxAmount || expense.amount <= parseFloat(filter.maxAmount))
      );
    });
    setFilteredExpenses(filtered);
  }, [expenses, filter]);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleExpenseDeleted = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense._id === updatedExpense._id ? updatedExpense : expense
    ));
  };
  

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" align="center" gutterBottom>
        Expense Tracker
      </Typography>
      <Box my={4}>
        <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
      </Box>
      <Box my={4}>
        <ExpenseFilter onFilterChange={setFilter} filter={filter} />
      </Box>
      <Box my={4}>
        <ExpenseList 
          expenses={filteredExpenses} 
          onDelete={handleExpenseDeleted}
          onEdit={setEditingExpense}
        />
      </Box>
      <Box my={4}>
        <ExpenseSummary expenses={filteredExpenses} />
      </Box>
      <Box my={4}>
        <ExpenseChart expenses={filteredExpenses} />
      </Box>
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onExpenseUpdated={handleExpenseUpdated}
        />
      )}
    </Container>
  );
}

export default App;