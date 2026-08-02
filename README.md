# Expense Tracker

Expense Tracker is a full-stack web application that helps users manage, categorize, budget, and visualize personal expenses. Built with React, Material-UI, Express.js, Mongoose, and MongoDB. Features robust **JWT authentication**, per-user data isolation, **standardized categories with validation**, **budget tracking with progress alerts**, **interactive charts**, **CSV export**, and **recurring expenses support with projections**.

## Recent Improvements & Refactors
(Aligned with prior analysis, bug/security/performance/duplicate fixes, and refactor stages — see `changes-report.docx` for full summary.)

**Refactors (Quality, Readability, Maintainability, Performance):**
- Extracted helpers (`validateCategory`, `buildCSVRow`, `calculateNextOccurrence`) in `backend/routes/expenses.js` and `backend/models/Expense.js`.
- Improved Mongoose pre-save hook and global error handlers in `backend/server.js`.
- Centralized constants in `backend/constants.js`; dynamic category loading in frontend components (no more duplication).
- User-scoped queries optimized; no behavior change to existing functionality.

**Fixes from Analysis:**
- Category validation bugs fixed (enums + route checks prevent inconsistent data).
- Security: Strengthened ownership checks in PATCH/DELETE; auth middleware everywhere.
- Performance: Efficient DB sorts, single queries, lightweight CSV generation. No duplicates found.
- Recurring/budget calculations hardened.

- **Backend**: Node.js, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, dotenv.
- **Frontend**: React 18, Material-UI (@mui/*), Axios, React Router, Recharts/React-ChartJS-2, date-fns, Context API.
- **Database**: MongoDB.
- **Docs**: Markdown + auto-generated DOCX.

## Architecture Overview
See [`architecture.md`](architecture.md) for detailed layered view, data flows, design decisions (helpers for maintainability, user-scoping for security, enums/hooks for consistency), and non-functional aspects.

## API Documentation
See [`api.md`](api.md) for complete endpoint reference, request/response examples, auth requirements, validation rules, and error codes. Key additions: `/categories`, `/recurring`, `/export`.

## Setup Guide
### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (local, Docker, or Atlas — update `backend/.env`)
- (Optional) Docker if adding containerization later.

### Installation
1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   npm run install:all
   ```
3. Configure environment (`backend/.env`):
   ```
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   PORT=5000
   ```

### Running the Application
1. Ensure MongoDB is running.
2. Start everything:
   ```bash
   npm run dev
   ```
   (Uses concurrently for backend on :5000 + frontend on :3000.)

Alternatively:
- Backend only: `npm run start:backend`
- Frontend only: `cd frontend && npm start`

Open http://localhost:3000. Register/login, use category dropdowns, recurring toggles in modals, view projections/badges, set budgets, export CSV from header.

## Docker Support (New Feature)
**Selected feature implemented**: Environment-aware API configuration (REACT_APP_API_URL + proxy in package.json + constants update across Login/Register/App) + full Docker containerization.

This aligns with existing architecture (Node/Express/Mongo layered with context providers, constants centralization, Mongoose models). Updates were made to frontend (API_BASE usage, proxy, Dockerfile/nginx), configuration (docker-compose, .env fallback), database (Mongo service), and documentation.

**Why it adds value**:
- Accelerates onboarding (one command `docker compose up --build` spins up full stack with Mongo, no local DB install needed).
- Ensures consistent environments across dev/prod/CI.
- Creates a living reference for deployment patterns.
- Supports the DME (Documentation Maintenance Engine) by including deployment in auto-report.
- Maintains all existing coding standards (no stubs, consistent with constants, error handling, user-scoping).

### Docker Setup
1. Ensure Docker + Docker Compose v2 installed.
2. Run:
   ```bash
   docker compose up --build
   ```
3. Access:
   - Frontend UI: http://localhost:3000
   - API: http://localhost:5000/api (health at /health)
   - Mongo: localhost:27017
4. Stop: `docker compose down -v`
5. Customize via `.env` or compose overrides.

## Project Structure
- `backend/`: server.js, models (User/Expense with hooks/enums/Budget), routes (with helpers/validation), middleware/auth.js, constants.js.
- `frontend/`: Standard CRA + src/components (modals, lists, charts, summary, auth), context, hooks, styles, constants.
- Root: package.json (with scripts), docs (README.md, architecture.md, api.md), `changes-report.docx`, Docker files.

