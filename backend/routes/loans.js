const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// POST /api/v1/loans - Create a new loan
router.post('/', async (req, res) => {
  try {
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;
    const db = req.app.locals.db;

    // Validate input
    if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if customer exists
    const customer = await db.get('SELECT * FROM customers WHERE customer_id = ?', [customer_id]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Calculate loan details
    const principal = parseFloat(loan_amount);
    const years = parseInt(loan_period_years);
    const rate = parseFloat(interest_rate_yearly);
    
    const totalInterest = principal * years * (rate / 100);
    const totalAmount = principal + totalInterest;
    const monthlyEMI = totalAmount / (years * 12);

    const loanId = uuidv4();

    // Insert loan
    await db.run(`
      INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, 
                        interest_rate, loan_period_years, monthly_emi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [loanId, customer_id, principal, totalAmount, rate, years, monthlyEMI]);

    res.status(201).json({
      loan_id: loanId,
      customer_id,
      total_amount_payable: totalAmount,
      monthly_emi: monthlyEMI
    });

  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/loans/:loanId/payments - Record a payment
router.post('/:loanId/payments', async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, payment_type } = req.body;
    const db = req.app.locals.db;

    // Validate input
    if (!amount || !payment_type) {
      return res.status(400).json({ error: 'Amount and payment_type are required' });
    }

    // Check if loan exists
    const loan = await db.get('SELECT * FROM loans WHERE loan_id = ?', [loanId]);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Calculate total paid so far
    const totalPaid = await db.get(`
      SELECT COALESCE(SUM(amount), 0) as total_paid 
      FROM payments WHERE loan_id = ?
    `, [loanId]);

    const newTotalPaid = totalPaid.total_paid + parseFloat(amount);
    const remainingBalance = loan.total_amount - newTotalPaid;
    const emisLeft = Math.max(0, Math.ceil(remainingBalance / loan.monthly_emi));

    // Record payment
    const paymentId = uuidv4();
    await db.run(`
      INSERT INTO payments (payment_id, loan_id, amount, payment_type)
      VALUES (?, ?, ?, ?)
    `, [paymentId, loanId, amount, payment_type]);

    // Update loan status if fully paid
    if (remainingBalance <= 0) {
      await db.run('UPDATE loans SET status = ? WHERE loan_id = ?', ['PAID_OFF', loanId]);
    }

    res.json({
      payment_id: paymentId,
      loan_id: loanId,
      message: 'Payment recorded successfully.',
      remaining_balance: Math.max(0, remainingBalance),
      emis_left: emisLeft
    });

  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/loans/:loanId/ledger - Get loan ledger
router.get('/:loanId/ledger', async (req, res) => {
  try {
    const { loanId } = req.params;
    const db = req.app.locals.db;

    // Get loan details
    const loan = await db.get('SELECT * FROM loans WHERE loan_id = ?', [loanId]);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Get all payments
    const payments = await db.all(`
      SELECT payment_id as transaction_id, payment_date as date, 
             amount, payment_type as type
      FROM payments 
      WHERE loan_id = ? 
      ORDER BY payment_date DESC
    `, [loanId]);

    // Calculate totals
    const totalPaid = await db.get(`
      SELECT COALESCE(SUM(amount), 0) as total_paid 
      FROM payments WHERE loan_id = ?
    `, [loanId]);

    const balanceAmount = loan.total_amount - totalPaid.total_paid;
    const emisLeft = Math.max(0, Math.ceil(balanceAmount / loan.monthly_emi));

    res.json({
      loan_id: loanId,
      customer_id: loan.customer_id,
      principal: loan.principal_amount,
      total_amount: loan.total_amount,
      monthly_emi: loan.monthly_emi,
      amount_paid: totalPaid.total_paid,
      balance_amount: Math.max(0, balanceAmount),
      emis_left: emisLeft,
      transactions: payments
    });

  } catch (error) {
    console.error('Error fetching ledger:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
