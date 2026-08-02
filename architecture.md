# Architecture Overview

## High-Level Architecture
This is a full-stack, monolithic expense tracker following a **client-server** pattern with clear separation of concerns. It uses the **MERN** stack (MongoDB, Express, React, Node.js) with JWT for stateless authentication.

- **Frontend**: React 18 single-page application (Create React App) with Material-UI for components, Recharts for visualizations, Axios for API calls, and React Context for auth state management. Protected routes via AuthContext interceptor adding Bearer tokens. Key components (ExpenseList, BudgetManager, ExpenseSummary, modals) fetch data dynamically and handle recurring/categories logic locally where possible for responsiveness.
- **Backend**: Express.js REST API with Mongoose ODM for MongoDB. Routes are modular (auth, expenses, budgets). All data operations are **user-scoped** using JWT-decoded user ID to enforce isolation.
- **Database**: MongoDB with schemas enforcing enums (CATEGORIES, FREQUENCIES, PAYMENT_METHODS), pre-save hooks for recurring nextOccurrence calculation, and indexes implied on user/date fields for query performance.
- **Deployment**: Local dev with separate backend/frontend servers (concurrently script). Production would use PM2/Nginx or Docker (no Dockerfile present in current repo despite prior references; see setup guide).

## Data Flow
1. User registers/logs in → JWT returned and stored in context.
2. Protected API calls (with auth middleware) → Mongoose queries scoped to `req.user.id`.
3. Frontend renders summaries/charts (ExpenseSummary uses date-fns for projections), modals for CRUD, CSV download via Blob.
4. Recurring logic: Pre-save hook + dedicated /recurring endpoint + badges/projections in UI.
5. Validation centralized (constants.js + route helpers + Mongoose enums) to prevent bad data.

## Key Design Decisions
- **No new heavy dependencies** for features (pure Node for CSV; date-fns already present).
- **Helpers extracted** (validateCategory, buildCSVRow, calculateNextOccurrence) for readability/maintainability (refactor stage).
- **Security**: JWT + ownership checks; no plain passwords (bcrypt in auth).
- **Performance**: Single queries, sorting in DB, efficient string building for export. No N+1 patterns observed.
- **Maintainability**: Modular routes/models, global error handlers, centralized constants.
- **Extensibility**: Easy to add more frequencies or categories via constants.js.

## Non-Functional
- Responsive UI (MUI).
- Error handling throughout.
- CSV for offline reporting.

See `api.md` for endpoints, `README.md` for setup, and `changes-report.docx` for full change summary. This architecture was preserved and enhanced through all refactors/fixes/features without breaking changes.

Last updated: 2026-08-02 (per task context).