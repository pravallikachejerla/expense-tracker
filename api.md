# API Documentation

## Authentication
All non-auth routes require `Authorization: Bearer <JWT>` header (provided by AuthContext).

### POST /api/auth/register
- Body: `{ "username": "...", "password": "..." }`
- Response: `{ "token": "..." }` or error.

### POST /api/auth/login
- Body: same as register.
- Returns JWT on success.

## Expenses (All protected, user-scoped)

### GET /api/expenses
- Returns array of user's expenses (sorted by date desc).

### GET /api/expenses/recurring
- Returns upcoming recurring expenses (`isRecurring=true`, `nextOccurrence >= now`).

### GET /api/expenses/categories
- Returns standardized list: `["Food", "Transportation", ... , "Other"]`.

### GET /api/expenses/export
- Streams CSV download (`expenses.csv`) with columns: Date, Amount, Category, Description, Payment Method, Recurring, Frequency, Next Occurrence.
- Uses user-scoped query + helper for row building.

### POST /api/expenses
- Body: `{ "amount": 50.0, "category": "Food", "description": "...", "date"?: "...", "paymentMethod"?: "...", "isRecurring"?: true, "frequency"?: "monthly", "nextOccurrence"?: "..." }`
- Validates category against enum; auto-sets nextOccurrence via pre-save hook if recurring.
- Returns created document (201).

### PATCH /api/expenses/:id
- Updates only owned expense. Validates category if provided. Partial updates supported.

### DELETE /api/expenses/:id
- Deletes only if owned by user.

## Budgets (All protected, user-scoped)

### GET/POST/DELETE /api/budgets
- Standard CRUD for monthly category budgets with progress tracking (see frontend BudgetManager).

## Error Handling
- 400 for validation (e.g. invalid category).
- 401/403 for auth failures (via middleware/auth.js).
- 404 for not found or no data.
- 500 for server errors (global handler in server.js logs stack).

## Standards
- JSON responses.
- Mongoose validation + custom helpers for consistency.
- No pagination yet (small-scale app).

See `constants.js` for enums, models for schemas, routes for implementation. All endpoints updated during refactor/analysis stages for security, performance, and new recurring/CSV features. Full details in `changes-report.docx`.

Generated as part of documentation task.