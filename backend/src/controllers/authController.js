import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kimi_finance_ultra_secure_secret_key_2026';

export const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()], async (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (row) return res.status(409).json({ message: 'An account with this email already exists' });

    try {
      const password_hash = await bcrypt.hash(password, 10);
      db.run(
        `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
        [name, email.toLowerCase(), password_hash],
        function (err) {
          if (err) return res.status(500).json({ message: 'Failed to create user' });

          const userId = this.lastID;
          const token = jwt.sign({ id: userId, email: email.toLowerCase() }, JWT_SECRET, { expiresIn: '7d' });

          return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
              id: userId,
              name,
              email: email.toLowerCase(),
              currency: 'USD ($)',
              monthlyBudget: 5000,
              joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: 'Server error while encrypting password' });
    }
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency || 'USD ($)',
        monthlyBudget: user.monthly_budget || 5000,
        joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
    });
  });
};

export const getProfile = (req, res) => {
  db.get('SELECT id, name, email, currency, monthly_budget, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency || 'USD ($)',
        monthlyBudget: user.monthly_budget || 5000,
        joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
    });
  });
};
