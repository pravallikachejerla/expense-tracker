import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddExpenseModal.css';
import useCategories from '../hooks/useCategories';
import { API_BASE } from '../constants';

import { 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledForm = styled('form')({
  width: '100%',
});

const StyledFormControl = styled(FormControl)({
  minWidth: 120,
  width: '100%',
});

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const AddExpenseForm = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Other');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { categories, loading: categoriesLoading } = useCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !description) {
      setError('Please fill all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/expenses`, {
        amount: parseFloat(amount),
        category,
        description,
        date,
        paymentMethod,
        isRecurring,
        frequency: isRecurring ? frequency : 'none'
      });
      onExpenseAdded(response.data);
      resetForm();
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('Other');
    setIsRecurring(false);
    setFrequency('monthly');
    setError('');
  };

  return (
    <FormPaper>
      <Typography variant="h6" gutterBottom>
        Add New Expense
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <StyledForm onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledFormControl>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                label="Category"
                disabled={categoriesLoading}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledFormControl>
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
            </StyledFormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  color="primary"
                />
              }
              label="Recurring Expense"
            />
          </Grid>
          {isRecurring && (
            <Grid item xs={12} sm={6}>
              <StyledFormControl>
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
              </StyledFormControl>
            </Grid>
          )}
        </Grid>
        <SubmitButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || categoriesLoading}
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </SubmitButton>
      </StyledForm>
    </FormPaper>
  );
};

export default AddExpenseForm;
