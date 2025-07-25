# Bank Lending System

A simple bank lending system built with a React.js frontend, Node.js/Express.js backend, and SQLite database. This application allows users to create loans, record payments, view loan ledgers, and check customer loan overviews.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Assumptions](#assumptions)
- [License](#license)

## Features
- Create new loans for customers with calculated EMI and total payable amount.
- Record EMI or lump-sum payments for existing loans.
- View detailed loan ledgers with transaction history.
- Display customer overviews with all associated loans.
- Responsive UI with Tailwind CSS styling.
- Error handling and loading states for better user experience.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Dependencies**:
  - Frontend: Axios, Lucide-React
  - Backend: SQLite3, UUID
- **Build Tool**: Vite (for frontend)

## Project Structure
```
bank-lending-system/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── database/
│   │   └── initDB.js
│   └── routes/
│       ├── loans.js
│       └── customers.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── components/
    │   │   ├── LoanForm.jsx
    │   │   ├── PaymentForm.jsx
    │   │   ├── LoanLedger.jsx
    │   │   └── CustomerOverview.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Loans.jsx
    │       └── Customers.jsx
    └── public/
```

## Setup Instructions
### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- SQLite (included as a dependency)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory with the following:
   ```
   VITE_API_URL=http://localhost:3000/api/v1
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or the port specified by Vite).

### Database
- The SQLite database (`bankLending.db`) is automatically initialized with sample customers (`CUST001 - John Doe`, `CUST002 - Jane Smith`) when the backend starts.
- The database file is created in the `backend` directory.

## API Endpoints
- **POST /api/v1/loans**: Create a new loan.
- **POST /api/v1/loans/:loanId/payments**: Record a payment for a loan.
- **GET /api/v1/loans/:loanId/ledger**: Retrieve loan details and transaction history.
- **GET /api/v1/customers/:customerId/overview**: View all loans for a customer.

## Usage
1. **Create a Loan**:
   - Go to the "Create Loan" section.
   - Select a customer, enter loan amount, loan period, and interest rate.
   - Submit to create a loan and view the calculated total amount and monthly EMI.
2. **Record a Payment**:
   - Go to the "Record Payment" section.
   - Enter the loan ID, payment amount, and select payment type (EMI or Lump Sum).
   - Submit to record the payment and view updated loan details.
3. **View Loan Ledger**:
   - Go to the "Loan Ledger" section.
   - Enter a loan ID to view the loan's summary and transaction history.
4. **View Customer Overview**:
   - Go to the "Customer Overview" section.
   - Select a customer to view all their loans with details like principal, total amount, and EMIs left.

## Assumptions
- Uses simple interest calculation: `Total Interest = Principal * Years * (Rate/100)`.
- EMI is calculated as `(Principal + Total Interest) / (Years * 12)`.
- Lump-sum payments reduce the outstanding balance, and remaining EMIs are recalculated.
- Customers are pre-existing in the database.
- The system uses SQLite for simplicity, but can be adapted for PostgreSQL or other SQL databases.

## License
This project is licensed under the MIT License.