# Expense Tracker

Expense Tracker is a web application that helps users manage and visualize their personal expenses. Built with React, Material-UI, Express, and MongoDB. Includes **user authentication**, per-user data isolation, **budget management**, **standardized categories**, and **CSV export**.

## Features

- User registration and login (JWT-based authentication)
- Add, edit, delete expenses (now scoped to logged-in user)
- Filter expenses by category, date, amount
- View expense summary statistics
- Visualize expenses with interactive charts (Recharts)
- **Set monthly budgets per category with real-time progress bars and over-budget alerts**
- **Standardized categories enforced across frontend and backend (with validation)**
- **Export all expenses to CSV for reporting/taxes**
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

These changes were implemented by modifying the existing codebase (models, routes, components, App.js, README) while preserving coding standards, error handling, MUI/React patterns, JWT user-scoping, and separation of concerns. No new heavy dependencies or breaking changes.

## Technologies Used

- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs
- **Frontend**: React.js, Material-UI, Axios, React Router, Recharts
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

4. Open http://localhost:3000. Register/login. Use standardized category dropdowns, set budgets, and use the **Export CSV** button in the header.

## API Endpoints

- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/expenses/categories` — Get standardized categories (protected)
- `GET/POST/PATCH/DELETE /api/expenses` — Protected expense CRUD (user-scoped, with category validation)
- `GET /api/expenses/export` — Download user expenses as CSV (protected)
- `GET/POST/DELETE /api/budgets` — Protected budget CRUD (user-scoped, with category validation)

All routes require `Authorization: Bearer <token>` header.

## Project Structure

- `backend/`: Express server, Mongoose models (User, Expense with category enum, Budget with category enum), routes (auth, expenses with export/categories, budgets), middleware
- `frontend/`: React app with AuthContext (axios interceptor for JWT), protected routes, MUI components (updated modals with dynamic categories and validation, BudgetManager, new export in App.js), charts

For development, use separate terminals for backend/frontend.

This update builds directly on the prior budget management implementation.
