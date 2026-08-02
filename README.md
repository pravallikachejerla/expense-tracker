# Expense Tracker

A full-stack web application for managing, categorizing, budgeting, and visualizing personal expenses. Built with **React + Material-UI**, **Express + Mongoose**, MongoDB, and JWT authentication. Supports standardized categories, recurring expenses with projections, budget tracking with alerts, interactive charts, CSV export, and full Docker deployment.

## Table of Contents
- [Recent Improvements](#recent-improvements)
- [Architecture Overview](#architecture-overview)
- [API Documentation](#api-documentation)
- [Setup Guide](#setup-guide)
- [Docker Support](#docker-support)
- [Project Structure](#project-structure)
- [Documentation](#documentation)

## Recent Improvements
(Aligned with refactor, analysis/fixes, feature implementation, and documentation stages — see [`changes-report.docx`](changes-report.docx) for full summary.)

**Refactors (Quality, Readability, Maintainability, Performance):**
- Extracted helpers (`validateCategory`, `buildCSVRow`, `calculateNextOccurrence`) in `backend/routes/expenses.js` and `backend/models/Expense.js`.
- Improved Mongoose pre-save hooks and global error handlers in `backend/server.js`.
- Centralized constants in `backend/constants.js`; dynamic category loading in frontend (no duplication).
- Optimized user-scoped queries; **no behavior change** to existing functionality.

**Fixes from Analysis Stage:**
- Fixed category validation (Mongoose enums + route checks).
- Strengthened security (ownership checks, auth middleware on all protected routes).
- Performance: DB-level sorts, single queries, lightweight CSV. No duplicate code found.
- Hardened recurring and budget calculations.

**Tech Stack:**
- **Backend**: Node.js, Express, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`.
- **Frontend**: React 18, Material-UI (`@mui/*`), Axios, React Router, Recharts, `date-fns`, Context API.
- **Database**: MongoDB.
- **Deployment**: Docker Compose + Nginx.
- **Docs**: Markdown + auto-generated DOCX report.

## Architecture Overview
See [`architecture.md`](architecture.md) for layered view, data flows (with Mermaid diagram), design decisions (helpers, user-scoping, enums/hooks), non-functional aspects, and deployment.

## API Documentation
See [`api.md`](api.md) for complete endpoint reference with request/response examples, auth requirements, validation, and error codes. Key endpoints: `/categories`, `/recurring`, `/export`.

## Setup Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm / yarn
- MongoDB (local instance, Docker, or MongoDB Atlas)
- Docker + Docker Compose (for containerized run)

### Local Installation & Run
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   npm run install:all
   ```
3. Create `backend/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   PORT=5000
   ```
4. Start MongoDB locally (or use Docker).
5. Run the full stack:
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000 (proxied to backend)

**Alternatives:**
- Backend only: `npm run start:backend`
- Frontend only: `cd frontend && npm start`

Register/login at the UI, add expenses (with recurring toggle), set budgets, view charts/summary/projections, export CSV.

### Testing
```bash
npm test --prefix backend
npm test --prefix frontend
```

## Docker Support
Fully containerized (selected feature). One-command startup with MongoDB, backend, and Nginx-served frontend.

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:5000 (includes `/health`)
- MongoDB: localhost:27017 (exposed for tools)
- Stop: `docker compose down -v`

See `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, and `frontend/nginx.conf`. Environment variables are passed through; `REACT_APP_API_URL` is respected.

**Benefits**: Consistent environments, no local MongoDB install required, accelerated onboarding.

## Project Structure
- `backend/`: `server.js`, models (with enums/pre-save hooks), routes (with helpers/validation), `middleware/auth.js`, `constants.js`.
- `frontend/`: React components, hooks, contexts (Auth/Theme), services, styles, constants (env-aware).
- Root: `package.json` (scripts including `generate:report`), Docker files, documentation.

## Documentation
- **README.md** (this file): Overview, setup (local + Docker), structure.
- **api.md**: Full REST API spec with examples.
- **architecture.md**: High-level design, flows, decisions, Mermaid diagram, deployment notes.
- **changes-report.docx**: Auto-generated summary of *all* implemented changes (refactors, fixes, features, Docker, this documentation update).
- Generated via `npm run generate:report` (uses `docx` library).

**This documentation was updated as part of Task Tc072e068** to improve clarity, add a dedicated Setup Guide, include examples, Mermaid diagrams, cross-references, and regenerate the DOCX report. All prior functionality, refactors, and features are preserved.

Last updated: 2026-08-02
