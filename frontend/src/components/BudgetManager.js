import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, LinearProgress, Alert } from '@mui/material';
import axios from 'axios';
import '../styles/ExpenseSummary.css'; // Reuse similar styles
import useCategories from '../hooks/useCategories';
import { API_BASE } from '../constants';

const BudgetManager = ({ expenses, onBudgetUpdate }) => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${API_BASE}/budgets`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to load budgets');
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.amount) {
      setError('Category and amount are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/budgets`, {
        category: newBudget.category,
        amount: parseFloat(newBudget.amount)
      });
      setBudgets([...budgets.filter(b => b.category !== newBudget.category), response.data]);
      setNewBudget({ category: '', amount: '' });
      setMessage('Budget updated successfully');
      if (onBudgetUpdate) onBudgetUpdate();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error setting budget:', error);
      setError(error.response?.data?.message || 'Error updating budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await axios.delete(`${API_BASE}/budgets/${id}`);
      setBudgets(budgets.filter(b => b._id !== id));
      setMessage('Budget deleted');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Error deleting budget');
    }
  };

  const getBudgetProgress = (budget) => {
    const spent = expenses
      .filter(exp => exp.category.toLowerCase() === budget.category.toLowerCase())
      .reduce((sum, exp) => sum + exp.amount, 0);
    const percentage = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
    const isOver = percentage > 100;
    return { spent, percentage, isOver };
  };

  return (
    <Box my={4}>
      <Typography variant="h5" gutterBottom>Budget Manager</Typography>
      
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSetBudget} sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={newBudget.category}
            label="Category"
            onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
            disabled={categoriesLoading}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Budget Amount"
          type="number"
          value={newBudget.amount}
          onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
          sx={{ width: 150 }}
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        />
        <Button type="submit" variant="contained" disabled={loading || categoriesLoading}>
          {loading ? 'Setting...' : 'Set Budget'}
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>Current Budgets</Typography>
      {budgets.map(budget => {
        const progress = getBudgetProgress(budget);
        return (
          <Box key={budget._id} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography><strong>{budget.category}</strong> (Monthly)</Typography>
              <Typography>${budget.amount.toFixed(2)}</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(progress.percentage, 100)} 
              color={progress.isOver ? "error" : "primary"}
              sx={{ height: 10, mb: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">
                Spent: ${progress.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color={progress.isOver ? "error" : "textSecondary"}>
                {progress.percentage.toFixed(0)}% {progress.isOver && '(Over Budget!)'}
              </Typography>
            </Box>
            <Button 
              size="small" 
              color="error" 
              onClick={() => handleDeleteBudget(budget._id)}
              sx={{ mt: 1 }}
            >
              Delete Budget
            </Button>
          </Box>
        );
      })}
      {budgets.length === 0 && <Typography>No budgets set yet. Add one above.</Typography>}
    </Box>
  );
};

export default BudgetManager;
