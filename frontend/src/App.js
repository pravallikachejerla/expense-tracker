import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';
import { useAuth, AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AddExpenseForm from './components/AddExpenseModal';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseFilter from './components/ExpenseFilter';
import EditExpenseModal from './components/EditExpenseModal';
import ExpenseChart from './components/ExpenseChart';
import BudgetManager from './components/BudgetManager';
import './App.css';

const MainApp = () => {
  const { logout, user } = useAuth();
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
  const [exportMessage, setExportMessage] = useState('');

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

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

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleExpenseDeleted = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense._id === updatedExpense._id ? updatedExpense : expense
    ));
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses/export', {
        responseType: 'blob'
      });
      
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
    } catch (error) {
      console.error('Export error:', error);
      setExportMessage('Failed to export CSV. No expenses found or server error.');
      setTimeout(() => setExportMessage(''), 4000);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Expense Tracker - {user?.username || 'User'}
          </Typography>
          <Button color="inherit" onClick={handleExport} sx={{ mr: 2 }}>
            Export CSV
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom>
          Expense Tracker
        </Typography>
        {exportMessage && (
          <Typography align="center" color={exportMessage.includes('success') ? 'success.main' : 'error'} sx={{ mb: 2 }}>
            {exportMessage}
          </Typography>
        )}
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
        <Box my={4}>
          <BudgetManager expenses={filteredExpenses} />
        </Box>
        {editingExpense && (
          <EditExpenseModal
            expense={editingExpense}
            onClose={() => setEditingExpense(null)}
            onExpenseUpdated={handleExpenseUpdated}
          />
        )}
      </Container>
    </>
  );
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Typography align="center" sx={{ mt: 8 }}>Loading...</Typography>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onSwitchToRegister={() => window.location.href = '/register'} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register onSwitchToLogin={() => window.location.href = '/login'} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <MainApp /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const AppWithProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProvider;
