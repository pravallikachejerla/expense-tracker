require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expensesRouter = require('./routes/expenses');
const authRouter = require('./routes/auth');
const budgetsRouter = require('./routes/budgets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (for verification, works without DB)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Expense Tracker API is running',
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/budgets', budgetsRouter);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (improves maintainability)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking for sandbox/CI)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker')
  .then(() => console.log('Connected to Database'))
  .catch((error) => console.error('Failed to connect to Database (expected in sandbox without MongoDB):', error.message));

// Always start server even if DB fails
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = app; // for potential testing
module.exports.server = server; // for graceful shutdown in tests if needed
