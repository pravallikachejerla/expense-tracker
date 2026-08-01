require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expensesRouter = require('./routes/expenses');
const authRouter = require('./routes/auth');
const budgetsRouter = require('./routes/budgets');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Database'))
  .catch((error) => console.error('Failed to connect to Database', error));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/budgets', budgetsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
