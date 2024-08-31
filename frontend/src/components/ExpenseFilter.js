import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import '../styles/ExpenseFilter.css';

const ExpenseFilter = ({ onFilterChange, filter }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <FormControl style={{ minWidth: 120 }}>
        <InputLabel>Time Period</InputLabel>
        <Select
          value={filter.period}
          onChange={(e) => onFilterChange({ ...filter, period: e.target.value })}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>

      {filter.period === 'custom' && (
        <>
          <TextField
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={filter.startDate}
            onChange={(e) => onFilterChange({ ...filter, startDate: e.target.value })}
          />
          <TextField
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={filter.endDate}
            onChange={(e) => onFilterChange({ ...filter, endDate: e.target.value })}
          />
        </>
      )}

      <TextField
        label="Category"
        value={filter.category}
        onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
      />

      <TextField
        label="Min Amount"
        type="number"
        value={filter.minAmount}
        onChange={(e) => onFilterChange({ ...filter, minAmount: e.target.value })}
      />

      <TextField
        label="Max Amount"
        type="number"
        value={filter.maxAmount}
        onChange={(e) => onFilterChange({ ...filter, maxAmount: e.target.value })}
      />
    </div>
  );
};

export default ExpenseFilter;
