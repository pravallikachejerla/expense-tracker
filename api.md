# API Documentation

## Authentication
All protected routes require an `Authorization: Bearer <JWT>` header (automatically added by `AuthContext` in the frontend).

### POST /api/auth/register
- **Request Body**: `{ "username": "user", "password": "pass123" }`
- **Response (201)**: `{ "token": "eyJ..." }`
- **Errors**: 400 (validation), 409 (user exists).

### POST /api/auth/login
- **Request Body**: same as register.
- **Response**: JWT token on success.
- **Errors**: 401 (invalid credentials).

## Expenses (All protected & user-scoped)
Base path: `/api/expenses`

### GET /api/expenses
- Query params: `?category=Food&startDate=...&endDate=...`
- Returns: array of expenses (sorted by date descending).
- Example Response: `[{"_id": "...", "amount": 45.5, "category": "Food", ...}]`

### GET /api/expenses/recurring
- Returns upcoming recurring expenses (`isRecurring: true`, `nextOccurrence >= now`).

### GET /api/expenses/categories
- Returns standardized list: `["Food", "Transportation", "Housing", "Utilities", "Healthcare", "Entertainment", "Shopping", "Travel", "Education", "Personal Care", "Other"]`.

### GET /api/expenses/export
- Returns CSV file download (`expenses.csv`).
- Columns: Date, Amount, Category, Description, Payment Method, Recurring, Frequency, Next Occurrence.
- Uses helper for row building; streams lightweight response.

### POST /api/expenses
- **Body**: 
  ```json
  {
    "amount": 50.0,
    "category": "Food",
    "description": "Groceries",
    "date": "2026-08-01T12:00:00Z",
    "paymentMethod": "Credit Card",
    "isRecurring": true,
    "frequency": "monthly"
  }
  ```
- Validates category against enum; auto-calculates `nextOccurrence` via pre-save hook if recurring.
- Returns created document (201).

### PATCH /api/expenses/:id
- Partial updates allowed. Validates category if changed. Only updates owned records.

### DELETE /api/expenses/:id
- Deletes only if owned by the authenticated user. Returns 204 on success.

## Budgets (All protected & user-scoped)
- **GET /api/budgets** — list current budgets with progress.
- **POST /api/budgets** — create monthly category budget.
- **DELETE /api/budgets/:id** — remove budget.

## Error Handling (Global in server.js)
- 400: Validation (invalid category, missing fields).
- 401/403: Authentication / authorization failures (via `middleware/auth.js`).
- 404: Resource not found.
- 500: Server errors (stack logged, user-friendly message returned).

## Standards & Notes
- All responses are JSON (except `/export`).
- Mongoose schemas enforce enums, required fields, and user scoping.
- Centralized validation via `constants.js` and extracted helpers.
- No pagination (designed for personal-scale data).
- Full test coverage via integration tests in `backend/__tests__/integration.test.js`.

**Updated as part of Task Tc072e068 (Documentation stage)** to include concrete request/response examples, improve readability, and cross-reference code. See `changes-report.docx` for full history of refactors, security/performance fixes, recurring/CSV features, and Docker implementation. All endpoints remain backward-compatible.
