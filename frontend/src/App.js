import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Typography, Box, AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useAuth, AuthProvider } from './context/AuthContext';
import { useTheme, ThemeProviderWrapper } from './context/ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import AddExpenseForm from './components/AddExpenseModal';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseFilter from './components/ExpenseFilter';
import EditExpenseModal from './components/EditExpenseModal';
import ExpenseChart from './components/ExpenseChart';
import BudgetManager from './components/BudgetManager';
import useExpenses from './hooks/useExpenses';
import useFilters from './hooks/useFilters';
import './App.css';

/**
 * Main authenticated app UI. Refactored to use custom hooks (useExpenses, useFilters)
 * for separation of concerns, improved readability, maintainability, and performance
 * (memoized filtering). Uses centralized API service via hooks. No behavior change.
 */
const MainApp = () => {
  const { logout, user } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { 
    expenses, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    exportExpenses, 
    exportMessage 
  } = useExpenses();
  
  const { filteredExpenses, filter, updateFilter } = useFilters(expenses);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleExpenseAdded = async (newExpenseData) => {
    try {
      await addExpense(newExpenseData);
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleExpenseUpdated = async (updatedData) => {
    if (!editingExpense) return;
    try {
      await updateExpense(editingExpense._id, updatedData);
      setEditingExpense(null);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleExpenseDeleted = async (id) => {
    try {
      await deleteExpense(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleExport = async () => {
    try {
      await exportExpenses();
    } catch (err) {
      // message handled in hook
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
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 2 }}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
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
          <Typography 
            align="center" 
            color={exportMessage.includes('success') ? 'success.main' : 'error'} 
            sx={{ mb: 2 }}
          >
            {exportMessage}
          </Typography>
        )}
        <Box my={4}>
          <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
        </Box>
        <Box my={4}>
          <ExpenseFilter onFilterChange={updateFilter} filter={filter} />
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

// Wrap with providers (ThemeProviderWrapper was missing in prior; added for correctness while preserving behavior)
const AppWithProviders = () => (
  <AuthProvider>
    <ThemeProviderWrapper>
      <App />
    </ThemeProviderWrapper>
  </AuthProvider>
);

export default AppWithProviders;
