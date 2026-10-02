# KIMI Finance — Personal Finance Management Dashboard

A modern, responsive full-stack personal finance management application built with a dark green / black / white fintech aesthetic.

---

## Features

- **Authentication**: JWT-based login & registration with encrypted passwords (bcrypt) and session persistence.
- **Financial Dashboard**:
  - Net Balance, Total Income, Total Expenses, and Savings Rate.
  - Interactive Cash Flow dynamics chart (Bar & Trend Line modes).
  - Quick ledger preview and real-time category breakdown.
- **Transactions Management**:
  - Filter by Type (Income/Expense), Category, and custom Search queries.
  - Multi-criteria Sorting (Date, Amount).
  - Export transactions to CSV.
  - Delete with confirmation.
- **Add Transaction**:
  - Income and Expense flows.
  - Quick amount presets (`+$25`, `+$50`, `+$100`, etc.).
  - Category selector, custom memo, and date picker.
- **Profile & Settings**:
  - Lifetime inflow/outflow metrics.
  - Currency selection & monthly budget target tracking.
- **Persistent Storage**:
  - Relational SQLite database (`backend/data/kimi_finance.db`).

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, SQLite (`sqlite3`), JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS.

---

## Getting Started

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Demo Credentials
- **Email**: `alex.kimi@finance.io`
- **Password**: `kimi123456`
- Or use the **"Fill Demo Credentials"** button on the login screen.
