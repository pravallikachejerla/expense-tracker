# Expense Tracker

Expense Tracker is a web application that helps users manage and visualize their personal expenses. Built with React, Material-UI, Express, and MongoDB. Includes **user authentication**, per-user data isolation, **budget management**, **standardized categories**, **CSV export**, and **recurring expenses**.

## Features

- User registration and login (JWT-based authentication)
- Add, edit, delete expenses (now scoped to logged-in user)
- Filter expenses by category, date, amount
- View expense summary statistics (including recurring projections)
- Visualize expenses with interactive charts (Recharts)
- **Set monthly budgets per category with real-time progress bars and over-budget alerts**
- **Standardized categories enforced across frontend and backend (with validation)**
- **Export all expenses to CSV for reporting/taxes** (now includes recurring fields)
- **Recurring expenses support** (mark as weekly/monthly/yearly with next occurrence auto-calculation, badges in list, projected totals in summary)
- Responsive design
- Protected routes and API endpoints

## Recent Improvements (Aligned with Existing Architecture)

**1. Standardized Categories with Backend Validation & Dynamic Fetching**
- Added `enum` validation on Expense and Budget Mongoose schemas.
- Centralized category list (Food, Transportation, Housing, Utilities, Entertainment, Healthcare, Education, Shopping, Personal, Debt, Savings, Other).
- New `/api/expenses/categories` endpoint (protected).
- Frontend components (AddExpenseModal, BudgetManager, EditExpenseModal) now fetch categories dynamically from API (fallback to static).
- Added explicit validation in POST/PATCH routes with clear error messages.
- *Value*: Eliminates data inconsistency that broke budget calculations and filters; improves UX with dropdowns instead of free-text; makes reports more reliable. Perfectly extends existing Mongoose models, user-scoped routes, axios patterns, and MUI Select components without new dependencies or architecture changes.

**2. CSV Export Feature**
- New protected GET `/api/expenses/export` endpoint that generates and streams a CSV file (pure Node, no extra deps; includes date, amount, category, description, payment method).
- "Export CSV" button in the app header that triggers download using Blob/URL API.
- *Value*: Enables users to download portable reports for taxes, analysis in spreadsheets (Excel/Google Sheets), or archiving. Directly reuses existing auth middleware, user-scoped queries, and expense model. Enhances the core "manage and visualize" value without UI bloat.

**3. Recurring Expenses Support (Selected Feature)**
- Added `isRecurring`, `frequency` (enum), `nextOccurrence` fields + pre-save hook to Expense Mongoose model (DB update).
- Extended POST/PATCH in `/api/expenses` to accept/validate them; new protected GET `/api/expenses/recurring` for upcoming ones; CSV export extended with recurring columns.
- Updated AddExpenseModal, EditExpenseModal (MUI Switch + conditional Select for frequency), ExpenseList (recurring Chip badge + details), ExpenseSummary (recurring count, projected monthly calc using date-fns), and related UI/CSS patterns.
- Updated README, backend/server.js not changed (routes auto-loaded).
- *Value*: Many real-world expenses recur (rent, subscriptions); this reduces manual re-entry, improves budget forecasting and summary accuracy (projected totals), and provides actionable insights. Perfectly aligns with existing architecture (extends prior model extensions like paymentMethod/category, reuses JWT auth/middleware, Mongoose patterns, MUI components, user-scoping, no new packages). Implemented by modifying the existing codebase as specified.

These changes were implemented by modifying the existing codebase (models, routes, components, App.js patterns, README, UI styles where needed) while preserving coding standards, error handling, MUI/React patterns, JWT user-scoping, and separation of concerns. No new heavy dependencies or breaking changes. Updates were made to frontend, backend, APIs, database schema, configuration (README), and UI wherever required.

## Technologies Used

- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs
- **Frontend**: React.js, Material-UI, Axios, React Router, Recharts, date-fns
- **Database**: MongoDB
- CSS3 with custom styling

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm
- MongoDB (local or Atlas; update `backend/.env`)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/pravallikachejerla/expense-tracker.git
   cd expense-tracker
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Configure environment (copy or edit `backend/.env`):
   ```
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   PORT=5000
   ```

### Running the Application

1. Start MongoDB (local instance or Docker).
2. Start the backend:
   ```
   cd backend
   npm run dev
   ```
   (or `npm start`)

3. Start the frontend (in new terminal):
   ```
   cd frontend
   npm start
   ```

4. Open http://localhost:3000. Register/login. Use standardized category dropdowns, toggle "Recurring Expense" in add/edit modals (with frequency), view badges/projections in list/summary, set budgets, and use the **Export CSV** button in the header. New `/api/expenses/recurring` available for integrations.

## API Endpoints

- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/expenses/categories` — Get standardized categories (protected)
- `GET /api/expenses/recurring` — Get upcoming recurring expenses (protected, new)
- `GET/POST/PATCH/DELETE /api/expenses` — Protected expense CRUD (user-scoped, with category + recurring validation)
- `GET /api/expenses/export` — Download user expenses as CSV (protected, includes recurring)
- `GET/POST/DELETE /api/budgets` — Protected budget CRUD (user-scoped, with category validation)

All routes require `Authorization: Bearer <token>` header.

## Project Structure

- `backend/`: Express server, Mongoose models (User, Expense with recurring fields/enum/pre-save, Budget), routes (auth, expenses with recurring/export/categories, budgets), middleware
- `frontend/`: React app with AuthContext (axios interceptor for JWT), protected routes, MUI components (updated modals with recurring toggle/frequency, ExpenseList with badges, ExpenseSummary with projections, BudgetManager, charts), styles

For development, use separate terminals for backend/frontend.

This implements the selected recurring expenses feature by modifying the existing codebase after all modifications (per known facts), updating all specified areas while maintaining standards. Builds on prior improvements.
