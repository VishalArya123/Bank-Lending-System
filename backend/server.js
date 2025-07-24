const express = require('express');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const { initializeDB, dbPath } = require('./database/initDB');
const loansRouter = require('./routes/loans');
const customersRouter = require('./routes/customers');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await initializeDB();
    
    // Make db available to routes
    app.locals.db = db;
    
    // Routes
    app.use('/api/v1/loans', loansRouter);
    app.use('/api/v1/customers', customersRouter);
    
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(`Server Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
