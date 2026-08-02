import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Chip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import '../styles/ExpenseList.css';

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  return (
    <div className="expense-list-container">
      <Typography variant="h4" className="expense-list-title">
        Expense List
      </Typography>
      <List className="expense-list">
        {expenses.map((expense) => (
          <ListItem key={expense._id} className="expense-item">
            <ListItemText
              primary={
                <Typography variant="subtitle1" className="expense-description">
                  {expense.description}
                  {expense.isRecurring && (
                    <Chip 
                      label="Recurring" 
                      color="secondary" 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" className="expense-amount">
                    ${expense.amount.toFixed(2)}
                  </Typography>
                  {' - '}
                  <Typography component="span" variant="body2" className="expense-category">
                    {expense.category}
                  </Typography>
                  {' - '}
                  <Typography component="span" variant="body2" className="expense-date">
                    {new Date(expense.date).toLocaleDateString()}
                  </Typography>
                  {expense.isRecurring && expense.frequency && (
                    <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({expense.frequency}) Next: {expense.nextOccurrence ? new Date(expense.nextOccurrence).toLocaleDateString() : 'N/A'}
                    </Typography>
                  )}
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => onEdit(expense)} className="edit-button">
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(expense._id)} className="delete-button">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ExpenseList;
