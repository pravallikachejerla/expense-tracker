import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import axios from 'axios';
import '../styles/EditExpenseModal.css';

const EditExpenseModal = ({ expense, onClose, onExpenseUpdated }) => {
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description);
  const [date, setDate] = useState(expense.date.split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(expense.paymentMethod || 'Other');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories, using defaults');
        setCategories([
          'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
          'Healthcare', 'Education', 'Shopping', 'Personal', 'Debt', 'Savings', 'Other'
        ]);
      }
    };
    fetchCategories();

    // Reset form when expense changes
    setAmount(expense.amount);
    setCategory(expense.category);
    setDescription(expense.description);
    setDate(expense.date.split('T')[0]);
    setPaymentMethod(expense.paymentMethod || 'Other');
    setError('');
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !description) {
      setError('Please fill all required fields');
      return;
    }
    try {
      const response = await axios.patch(`http://localhost:5000/api/expenses/${expense._id}`, {
        amount: parseFloat(amount),
        category,
        description,
        date,
        paymentMethod
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
