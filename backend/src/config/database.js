import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../data/kimi_finance.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    // Enable Foreign Keys
    db.run('PRAGMA foreign_keys = ON;');

    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        currency TEXT DEFAULT 'USD ($)',
        monthly_budget REAL DEFAULT 5000.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Seed default demo user if not exists
    db.get('SELECT * FROM users WHERE email = ?', ['alex.kimi@finance.io'], async (err, row) => {
      if (!row) {
        const hash = await bcrypt.hash('kimi123456', 10);
        db.run(
          `INSERT INTO users (name, email, password_hash, currency, monthly_budget) 
           VALUES (?, ?, ?, ?, ?)`,
          ['Alex Morgan', 'alex.kimi@finance.io', hash, 'USD ($)', 5000.00],
          function (err) {
            if (!err) {
              const demoUserId = this.lastID;
              console.log('Seeded demo user with ID:', demoUserId);
              seedTransactions(demoUserId);
            }
          }
        );
      }
    });
  });
}

function seedTransactions(userId) {
  const defaultTx = [
    ['tx-1', userId, 'Income', 5800.00, 'Salary', 'Tech Lead Monthly Salary', '2026-09-01'],
    ['tx-2', userId, 'Income', 1450.00, 'Freelance', 'Fintech UI/UX Consulting', '2026-09-05'],
    ['tx-3', userId, 'Expense', 1850.00, 'Housing', 'Apartment Rental & Utilities', '2026-09-03'],
    ['tx-4', userId, 'Expense', 340.50, 'Food & Dining', 'Weekly Organic Groceries & Dining', '2026-09-07'],
    ['tx-5', userId, 'Expense', 120.00, 'Transportation', 'EV Charging & Metro Pass', '2026-09-08'],
    ['tx-6', userId, 'Income', 420.00, 'Investments', 'Dividend Yield - High Growth ETF', '2026-09-10'],
    ['tx-7', userId, 'Expense', 215.00, 'Entertainment', 'Concert & Streaming Subscriptions', '2026-09-12']
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO transactions (id, user_id, type, amount, category, description, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  defaultTx.forEach((tx) => stmt.run(tx));
  stmt.finalize();
  console.log('Seeded initial financial transactions.');
}

export default db;
