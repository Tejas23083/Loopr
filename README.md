# Loopr — Financial Analytics Dashboard

A full-stack financial analytics application built with React + TypeScript (frontend) and Node.js + Express + MongoDB (backend).

---

## Features

- **JWT Authentication** — Secure login/logout with token stored in localStorage
- **Dashboard** — Summary metric cards (Balance, Revenue, Expenses, Savings) + Area chart (Revenue vs Expenses by month)
- **Transactions Table** — Paginated, sortable table with real-time search and multi-field filters
- **Advanced Filtering** — Filter by category, status, user, date range, and amount range
- **CSV Export** — Configurable column selection modal; auto-downloads file to browser
- **Alert Chips** — Auto-dismissing toast notifications for errors, success, warnings, and info
- **Dark UI** — Matches the provided Figma design system

---

## Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Recharts, Axios, React Router v6, Lucide Icons |
| Backend    | Node.js, Express, TypeScript, Mongoose           |
| Database   | MongoDB                                          |
| Auth       | JWT (jsonwebtoken + bcryptjs)                   |
| CSV        | json2csv                                         |

---

## Prerequisites

- Node.js v18+
- MongoDB running locally on `mongodb://localhost:27017` (or update `.env`)
- npm v9+

---

## Setup & Running

### 1. Clone / open workspace

```
d:\Loopr\
├── backend\
├── frontend\
└── transactions.json
```

### 2. Backend

```bash
cd backend
npm install
```

Create/verify `.env` (already included):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loopr_finance
JWT_SECRET=loopr_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
```

**Seed the database** (loads `transactions.json` + creates demo users):
```bash
npm run seed
```

**Start the dev server:**
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## Demo Credentials

| Role    | Email              | Password   |
|---------|--------------------|------------|
| Analyst | demo@loopr.com     | demo1234   |
| Admin   | admin@loopr.com    | admin1234  |

---

## API Documentation

Base URL: `http://localhost:5000/api`

All endpoints except `/auth/login` and `/auth/register` require:
```
Authorization: Bearer <jwt_token>
```

---

### Auth

#### `POST /auth/register`
Register a new user.

**Body:**
```json
{ "email": "user@example.com", "password": "secret123", "name": "Jane Doe" }
```

**Response:**
```json
{ "success": true, "token": "...", "user": { "id": "...", "email": "...", "name": "...", "role": "analyst" } }
```

---

#### `POST /auth/login`
Authenticate and receive a JWT.

**Body:**
```json
{ "email": "demo@loopr.com", "password": "demo1234" }
```

**Response:**
```json
{ "success": true, "token": "...", "user": { "id": "...", "email": "...", "name": "...", "role": "analyst" } }
```

---

#### `GET /auth/me`
Returns the current authenticated user.

#### `POST /auth/logout`
Invalidates the session (client-side token removal).

---

### Transactions

#### `GET /transactions`
Returns a paginated, filtered, sorted list of transactions.

**Query Parameters:**

| Param       | Type   | Description                        |
|-------------|--------|------------------------------------|
| search      | string | Search across user_id, category, status |
| category    | string | `Revenue` or `Expense`             |
| status      | string | `Paid` or `Pending`                |
| user_id     | string | e.g. `user_001`                    |
| dateFrom    | string | ISO date string                    |
| dateTo      | string | ISO date string                    |
| minAmount   | number | Minimum amount filter              |
| maxAmount   | number | Maximum amount filter              |
| sortBy      | string | `date`, `amount`, `category`, `status`, `user_id` |
| sortOrder   | string | `asc` or `desc` (default: `desc`)  |
| page        | number | Page number (default: 1)           |
| limit       | number | Items per page, max 100 (default: 10) |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 215, "totalPages": 22 }
}
```

---

#### `GET /transactions/:id`
Returns a single transaction by its numeric `id`.

---

#### `POST /transactions/export/csv`
Generates and streams a CSV file.

**Body:**
```json
{
  "columns": ["id", "date", "amount", "category", "status", "user_id"],
  "filters": {
    "category": "Revenue",
    "status": "Paid"
  }
}
```

Available columns: `id`, `date`, `amount`, `category`, `status`, `user_id`

**Response:** `text/csv` file download

---

### Analytics

#### `GET /analytics/summary`
Returns aggregate totals.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 245000,
    "totalExpenses": 180000,
    "balance": 65000,
    "savings": 19500,
    "transactionCount": 215
  }
}
```

---

#### `GET /analytics/monthly?year=2024`
Returns monthly revenue and expenses broken down by month.

**Response:**
```json
{
  "success": true,
  "data": [
    { "month": "Jan", "revenue": 12400, "expenses": 8200 },
    ...
  ]
}
```

---

#### `GET /analytics/recent`
Returns the 5 most recent transactions.

---

## CSV Export Format

Example exported file (`transactions_2024-09-12.csv`):

```csv
ID,Date,Amount,Category,Status,User ID
1,2024-01-15,$1500.00,Revenue,Paid,user_001
2,2024-02-21,$1200.50,Expense,Paid,user_002
...
```

---

## Project Structure

```
d:\Loopr\
├── transactions.json          # Source data (215 records)
├── README.md
│
├── backend/
│   ├── src/
│   │   ├── models/            # User.ts, Transaction.ts
│   │   ├── routes/            # auth.ts, transactions.ts, analytics.ts
│   │   ├── middleware/        # auth.ts (JWT guard)
│   │   ├── scripts/           # seed.ts
│   │   └── server.ts          # Express entry point
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/               # axios.ts, auth.ts, transactions.ts, analytics.ts
    │   ├── components/
    │   │   ├── common/        # AlertChips.tsx, ProtectedRoute.tsx
    │   │   ├── dashboard/     # Sidebar, TopBar, DashboardLayout, SummaryCards, OverviewChart, RecentTransactions
    │   │   └── transactions/  # FilterBar, TransactionTable, ExportModal
    │   ├── context/           # AuthContext.tsx, AlertContext.tsx
    │   ├── pages/             # LoginPage, DashboardPage, TransactionsPage, PlaceholderPage
    │   ├── types/             # index.ts
    │   └── App.tsx
    ├── index.html
    ├── package.json
    └── tsconfig.json
```
