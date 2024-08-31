import React from 'react';
import { format } from 'date-fns';
import '../styles/ExpenseSummary.css';

const ExpenseSummary = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categorySummary = expenses.reduce((summary, expense) => {
    summary[expense.category] = (summary[expense.category] || 0) + expense.amount;
    return summary;
  }, {});

  const monthlySummary = expenses.reduce((summary, expense) => {
    const monthYear = format(new Date(expense.date), 'MMM yyyy');
    summary[monthYear] = (summary[monthYear] || 0) + expense.amount;
    return summary;
  }, {});

  const averageExpense = totalExpenses / expenses.length || 0;
  const highestExpense = Math.max(...expenses.map(e => e.amount), 0);
  const lowestExpense = Math.min(...expenses.map(e => e.amount), 0);

  return (
    <div className="expense-summary">
      <h2 className="summary-title">Expense Summary</h2>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-label">Total Expenses</div>
          <div className="summary-value">${totalExpenses.toFixed(2)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Average Expense</div>
          <div className="summary-value">${averageExpense.toFixed(2)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Highest Expense</div>
          <div className="summary-value">${highestExpense.toFixed(2)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Lowest Expense</div>
          <div className="summary-value">${lowestExpense.toFixed(2)}</div>
        </div>
      </div>

      <div className="category-summary">
        <h3 className="summary-subtitle">By Category</h3>
        <ul className="summary-list">
          {Object.entries(categorySummary).map(([category, amount]) => (
            <li key={category} className="summary-list-item">
              <span className="category-name">{category}</span>
              <span>
                <span className="category-amount">${amount.toFixed(2)}</span>
                <span className="category-percentage"> ({((amount / totalExpenses) * 100).toFixed(2)}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="monthly-summary">
        <h3 className="summary-subtitle">Monthly Summary</h3>
        <ul className="summary-list">
          {Object.entries(monthlySummary).map(([monthYear, amount]) => (
            <li key={monthYear} className="summary-list-item">
              <span className="month-name">{monthYear}</span>
              <span className="month-amount">${amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseSummary;
