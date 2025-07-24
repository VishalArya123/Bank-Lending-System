const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../bankLending.db');

const initializeDB = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create Customers table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Loans table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS loans (
        loan_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        principal_amount DECIMAL NOT NULL,
        total_amount DECIMAL NOT NULL,
        interest_rate DECIMAL NOT NULL,
        loan_period_years INTEGER NOT NULL,
        monthly_emi DECIMAL NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);

    // Create Payments table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id TEXT PRIMARY KEY,
        loan_id TEXT NOT NULL,
        amount DECIMAL NOT NULL,
        payment_type TEXT NOT NULL,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
      )
    `);

    // Insert sample customers
    await db.run(`
      INSERT OR IGNORE INTO customers (customer_id, name) 
      VALUES ('CUST001', 'John Doe'), ('CUST002', 'Jane Smith')
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

module.exports = { initializeDB, dbPath };
