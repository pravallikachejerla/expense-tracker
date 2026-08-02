import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';
import '../styles/EditExpenseModal.css';
import useCategories from '../hooks/useCategories';
import { API_BASE } from '../constants';

const EditExpenseModal = ({ expense, onClose, onExpenseUpdated }) => {
  const [amount, setAmount] = useState(expense?.amount || '');
  const [category, setCategory] = useState(expense?.category || '');
  const [description, setDescription] = useState(expense?.description || '');
  const [date, setDate] = useState(expense?.date ? expense.date.split('T')[0] : '');
  const [paymentMethod, setPaymentMethod] = useState(expense?.paymentMethod || 'Other');
  const [isRecurring, setIsRecurring] = useState(expense?.isRecurring || false);
  const [frequency, setFrequency] = useState(expense?.frequency && expense.frequency !== 'none' ? expense.frequency : 'monthly');
  const [error, setError] = useState('');

  const { categories, loading: categoriesLoading } = useCategories();

  // Reset form when expense prop changes (single source of truth, no duplication)
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount || '');
      setCategory(expense.category || '');
      setDescription(expense.description || '');
      setDate(expense.date ? expense.date.split('T')[0] : '');
      setPaymentMethod(expense.paymentMethod || 'Other');
      setIsRecurring(expense.isRecurring || false);
      setFrequency(expense.frequency && expense.frequency !== 'none' ? expense.frequency : 'monthly');
      setError('');
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !description) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const response = await axios.patch(`${API_BASE}/expenses/${expense._id}`, {
        amount: parseFloat(amount),
        category,
        description,
        date,
        paymentMethod,
        isRecurring,
        frequency: isRecurring ? frequency : 'none'
      });
      onExpenseUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating expense:', error);
      setError(error.response?.data?.message || 'Failed to update expense');
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Expense</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              disabled={categoriesLoading}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Debit Card">Debit Card</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                color="primary"
              />
            }
            label="Recurring Expense"
            sx={{ mt: 2, display: 'block' }}
          />
          {isRecurring && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Frequency</InputLabel>
              <Select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                label="Frequency"
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Update Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditExpenseModal;
