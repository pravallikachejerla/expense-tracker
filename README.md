# Expense Tracker

Expense Tracker is a web application that helps users manage and visualize their personal expenses. Built with React, Material-UI, Express, and MongoDB. Now includes **user authentication**, per-user data isolation, **and budget management** for proactive spending control.

## Features

- User registration and login (JWT-based authentication)
- Add, edit, delete expenses (now scoped to logged-in user)
- Filter expenses by category, date, amount
- View expense summary statistics
- Visualize expenses with interactive charts (Recharts/Chart.js)
- **Set monthly budgets per category with real-time progress bars and over-budget alerts**
- Responsive design
- Protected routes and API endpoints

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

4. Open http://localhost:3000. Register a new account or login. All expenses are now private to your user. Use the new **Budget Manager** section to set category budgets and monitor progress (visual alerts appear when over budget).

## API Endpoints

- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login and receive JWT
- `GET/POST/PATCH/DELETE /api/expenses` — Protected expense CRUD (user-scoped)
- `GET/POST/DELETE /api/budgets` — Protected budget CRUD (user-scoped, supports monthly per-category budgets)

All routes require `Authorization: Bearer <token>` header.

## Project Structure

- `backend/`: Express server, Mongoose models (User, Expense, Budget), routes (auth, expenses, budgets), middleware
- `frontend/`: React app with AuthContext, protected routes, MUI components (including new BudgetManager with progress bars), charts

This feature (Budget Management) was implemented by modifying the existing codebase (new Budget model + routes, updated server.js, new BudgetManager component, updated App.js and README) while preserving original coding standards, error handling, MUI/React patterns, user-scoping, and UI/UX.

For development, use separate terminals for backend/frontend.
