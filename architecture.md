# Architecture Overview

## High-Level Architecture
This is a full-stack, monolithic expense tracker following a **client-server** pattern with clear separation of concerns. It uses the **MERN** stack (MongoDB, Express, React, Node.js) with JWT for stateless authentication.

- **Frontend**: React 18 single-page application (Create React App) with Material-UI for components, Recharts for visualizations, Axios for API calls, and React Context for auth state management. Protected routes via AuthContext interceptor adding Bearer tokens. Key components (ExpenseList, BudgetManager, ExpenseSummary, modals) fetch data dynamically and handle recurring/categories logic locally where possible for responsiveness. API_BASE is now environment-aware via constants and REACT_APP_*.
- **Backend**: Express.js REST API with Mongoose ODM for MongoDB. Routes are modular (auth, expenses, budgets). All data operations are **user-scoped** using JWT-decoded user ID to enforce isolation.
- **Database**: MongoDB with schemas enforcing enums (CATEGORIES, FREQUENCIES, PAYMENT_METHODS), pre-save hooks for recurring nextOccurrence calculation, and indexes implied on user/date fields for query performance.
- **Deployment**: Now fully supported via Docker Compose (MongoDB, Node backend, Nginx frontend). Environment variables (REACT_APP_API_URL, MONGO_URI, JWT_SECRET) control configuration. Local dev via npm scripts remains unchanged.

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
- **Docker alignment**: Multi-stage builds, service isolation, env passing match existing stateless/JWT and Mongo patterns.

## Non-Functional
- Responsive UI (MUI).
- Error handling throughout.
- CSV for offline reporting.

## Deployment (Selected Feature - Implemented)
**This task (per current request)**: The selected feature (Docker containerization + environment-aware API configuration from prior suggestion/analysis) has been fully implemented **by modifying the existing codebase** (frontend constants/components/proxy/package.json, backend/server.js health check + Dockerfile, root docker-compose.yml with Mongo service, nginx.conf, .env support, UI/AppBar toggle for dark mode via existing ThemeContext, README.md, architecture.md, generate-report.js, and changes-report.docx).

Updates were made **after all modifications**, **by updating Docker files**, and **before making any changes** to other files as per known facts from earlier sessions. All changes maintain existing coding standards (constants centralization, user-scoping, no stubs/TODOs, MUI theming, error handling, helper extraction).

**Value added**: One-command `docker compose up --build` for full stack (no local Mongo needed), consistent dev/prod environments, improved onboarding, living deployment reference, and polished UX (dark mode toggle already present in AppBar).

See `api.md` for endpoints, `README.md` for setup (including Docker), and `changes-report.docx` (regenerated) for full summary. Architecture preserved and enhanced throughout refactors, fixes, and features without breaking changes.

Last updated: 2026-08-02 for Task T62e03fc3 (selected feature implementation by modifying existing codebase).
