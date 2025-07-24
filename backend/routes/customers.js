const express = require('express');
const router = express.Router();

// GET /api/v1/customers/:customerId/overview - Get customer overview
router.get('/:customerId/overview', async (req, res) => {
  try {
    const { customerId } = req.params;
    const db = req.app.locals.db;

    // Check if customer exists
    const customer = await db.get('SELECT * FROM customers WHERE customer_id = ?', [customerId]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get all loans for customer
    const loans = await db.all('SELECT * FROM loans WHERE customer_id = ?', [customerId]);
    
    if (loans.length === 0) {
      return res.status(404).json({ error: 'No loans found for customer' });
    }

    // Calculate details for each loan
    const loanDetails = await Promise.all(loans.map(async (loan) => {
      const totalPaid = await db.get(`
        SELECT COALESCE(SUM(amount), 0) as total_paid 
        FROM payments WHERE loan_id = ?
      `, [loan.loan_id]);

      const balanceAmount = loan.total_amount - totalPaid.total_paid;
      const emisLeft = Math.max(0, Math.ceil(balanceAmount / loan.monthly_emi));
      const totalInterest = loan.total_amount - loan.principal_amount;

      return {
        loan_id: loan.loan_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        total_interest: totalInterest,
        emi_amount: loan.monthly_emi,
        amount_paid: totalPaid.total_paid,
        emis_left: emisLeft
      };
    }));

    res.json({
      customer_id: customerId,
      total_loans: loans.length,
      loans: loanDetails
    });

  } catch (error) {
    console.error('Error fetching customer overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
