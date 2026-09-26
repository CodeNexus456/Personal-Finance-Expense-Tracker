# FinTrack - Personal Finance & Expense Tracker

> A full-stack MERN (MongoDB, Express, React, Node.js) web application built to help individuals monitor daily expenses, plan monthly category budgets, and analyze spending habits through clean, intuitive dashboards.

---

## 📌 Project Overview

**FinTrack** was designed and developed as a complete full-stack portfolio project for software engineering and full-stack developer internships. Unlike bloated financial applications or generic AI-generated templates, FinTrack focuses on **clarity, speed, data integrity, and strict user privacy**.

Every transaction and budget record is strictly scoped to the authenticated user using JSON Web Tokens (JWT) and Bcrypt password hashing.

---

## ✨ Key Features

### 1. 🔐 User Authentication & Authorization
- **Registration**: Client-side validation for emails, matching passwords, and min-length requirements.
- **Login**: Instant JWT generation with persistent session recovery via `localStorage`.
- **Password Security**: Passwords salted and hashed with `bcryptjs` (10 rounds).
- **Protected Routes & Data Isolation**: All `/api/transactions` and `/api/budgets` endpoints verify token claims so no user can access or manipulate another user's financial records.
- **1-Click Demo Login**: Pre-configured test account (`demo@fintrack.app` / `demo123`) with realistic sample data for instant portfolio review.

### 2. 📊 Real-Time Financial Dashboard
- **Top 3 KPI Summary Cards**: Total Balance (net), Total Income (+), and Total Expenses (-).
- **Dynamic Category Breakdown**: Visual percentage bars highlighting where money goes (Food, Bills, Transport, etc.).
- **6-Month Historical Trends**: Double-bar comparative chart of monthly earnings vs spending.
- **Recent Activity Feed**: Quick overview of the latest 6 transactions with category badges and payment methods.

### 3. 💸 Transaction System
- **Two Transaction Types**: Income (+) and Expense (-).
- **Core Fields**: Title, Amount (₹), Category, Date, Payment Method (Cash, Card, UPI, Bank Transfer), and Optional Description.
- **Filtering & Searching**:
  - Live search across titles, notes, and payment methods.
  - Filter by Type (All / Income / Expense).
  - Filter by Category.
  - Custom date range filter (`startDate` to `endDate`).
  - Sorting: Newest first, Oldest first, Highest amount, Lowest amount.
- **CSV Data Export**: 1-click export of filtered transaction history to CSV for external spreadsheets.
- **Full CRUD**: Add, edit existing entries, and delete with safety confirmation dialogs.

### 4. 🎯 Monthly Budget Planner
- **Category-Wise Spending Limits**: Set monthly caps (e.g. Food → ₹5,000, Transport → ₹3,000).
- **Live Spending Comparison**: Automatically calculates actual spent amount from transactions within the month.
- **Visual Progress Bars**:
  - 🟢 Green: Spending below 80% of budget limit.
  - 🟡 Amber: Spending between 80% and 100%.
  - 🔴 Red with Alert Badge: Exceeded budget with exact overrun calculation.
- **Month & Year Selector**: Easily audit past months or plan upcoming budgets.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB / Mongoose compatible document store with file-backed persistence |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing |
| **Tooling** | Vite, tsx, ESLint, TypeScript compiler |

---

## 📂 Project Structure

```text
finance-tracker/
│
├── server/
│   ├── config/
│   │   └── db.ts                  # Database adapter & resilient persistence store
│   ├── controllers/
│   │   ├── authController.ts       # Registration, login, profile retrieval
│   │   ├── transactionController.ts# Transaction CRUD, search & filtering
│   │   ├── budgetController.ts     # Monthly budget management & spent calculation
│   │   └── dashboardController.ts  # Aggregated KPI & monthly chart metrics
│   ├── middleware/
│   │   └── authMiddleware.ts       # Bearer token verification & route protection
│   ├── models/
│   │   ├── User.ts                 # User model definition
│   │   ├── Transaction.ts          # Transaction model definition
│   │   └── Budget.ts               # Budget model definition
│   └── routes/
│       ├── authRoutes.ts
│       ├── transactionRoutes.ts
│       ├── budgetRoutes.ts
│       └── dashboardRoutes.ts
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Responsive top navigation & user menu
│   │   ├── TransactionModal.tsx    # Modal form to add/edit transactions
│   │   └── BudgetModal.tsx         # Modal form to set category limits
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication state provider & hooks
│   ├── pages/
│   │   ├── Home.tsx                # Portfolio landing page
│   │   ├── Login.tsx               # Login with 1-click demo button
│   │   ├── Register.tsx            # Form-validated user sign up
│   │   ├── Dashboard.tsx           # Main analytics dashboard
│   │   ├── Transactions.tsx        # Filterable transaction table & CSV export
│   │   └── Budgets.tsx             # Monthly budget planner & progress bars
│   ├── services/
│   │   └── api.ts                  # Configured Axios instance with JWT interceptors
│   ├── utils/
│   │   └── formatters.ts           # Currency, date, and category badge helpers
│   ├── App.tsx                     # Main routing & state coordinator
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind CSS imports
│
├── server.ts                       # Express + Vite middleware server entry
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/personal-finance-tracker.git
   cd personal-finance-tracker
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Configure the variables inside `.env`:
   ```env
   PORT=3000
   JWT_SECRET="your_custom_jwt_secret_key"
   MONGO_URI="mongodb://localhost:27017/fintrack" # Optional: falls back to local data store
   ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

### Auth Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes |

### Transaction Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/transactions` | Query user transactions with filters | Yes |
| `POST` | `/api/transactions` | Create new transaction | Yes |
| `PUT` | `/api/transactions/:id` | Update existing transaction | Yes |
| `DELETE` | `/api/transactions/:id` | Delete transaction | Yes |

### Budget Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/budgets` | Fetch monthly budgets with spent metrics | Yes |
| `POST` | `/api/budgets` | Create or update category budget | Yes |
| `PUT` | `/api/budgets/:id` | Update budget limit amount | Yes |
| `DELETE` | `/api/budgets/:id` | Delete category budget | Yes |

### Dashboard Endpoint
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/dashboard/stats` | Aggregated balances, category breakdown, trends | Yes |

---

## 🧪 Testing the Application

### Demo Credentials
- **Email:** `demo@fintrack.app`
- **Password:** `demo123`
*(Or simply click the **"Try Demo (Rahul)"** button on the Login/Home page)*

---

## 🔮 Future Improvements

- Recurring transactions (automatic monthly subscriptions like Netflix or Rent)
- Multi-currency conversion (USD, EUR, GBP, JPY with live exchange rates)
- Receipt image uploads with optical character recognition (OCR)
- PDF monthly report generation for tax accounting

---

## 📄 License

This project is open-source under the MIT License. Built with ❤️ for software engineering internships and portfolio demonstration.
