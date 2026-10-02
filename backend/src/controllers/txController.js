import db from '../config/database.js';

export const getTransactions = (req, res) => {
  const userId = req.user.id;
  const { type, category, search } = req.query;

  let query = `SELECT * FROM transactions WHERE user_id = ?`;
  const params = [userId];

  if (type && type.toUpperCase() !== 'ALL') {
    query += ` AND UPPER(type) = ?`;
    params.push(type.toUpperCase());
  }

  if (category && category.toUpperCase() !== 'ALL') {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (search) {
    query += ` AND (description LIKE ? OR category LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY date DESC, created_at DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ message: 'Failed to fetch transactions' });
    }
    return res.json(rows);
  });
};

export const addTransaction = (req, res) => {
  const userId = req.user.id;
  const { type, amount, category, description, date } = req.body;

  if (!type || !amount || !category) {
    return res.status(400).json({ message: 'Type, amount, and category are required' });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number' });
  }

  const txId = req.body.id || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const txDate = date || new Date().toISOString().split('T')[0];
  const txDesc = description || category;

  db.run(
    `INSERT INTO transactions (id, user_id, type, amount, category, description, date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [txId, userId, type, parsedAmount, category, txDesc, txDate],
    function (err) {
      if (err) {
        console.error('Error inserting transaction:', err);
        return res.status(500).json({ message: 'Failed to create transaction' });
      }

      return res.status(201).json({
        id: txId,
        userId,
        type,
        amount: parsedAmount,
        category,
        description: txDesc,
        date: txDate
      });
    }
  );
};

export const deleteTransaction = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  db.run(
    `DELETE FROM transactions WHERE id = ? AND user_id = ?`,
    [id, userId],
    function (err) {
      if (err) {
        console.error('Error deleting transaction:', err);
        return res.status(500).json({ message: 'Failed to delete transaction' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Transaction not found or unauthorized' });
      }

      return res.json({ message: 'Transaction deleted successfully', id });
    }
  );
};

export const getSummary = (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT type, amount, date FROM transactions WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to generate summary' });
      }

      let totalIncome = 0;
      let totalExpenses = 0;

      rows.forEach((row) => {
        if (row.type.toLowerCase() === 'income') {
          totalIncome += Number(row.amount);
        } else if (row.type.toLowerCase() === 'expense') {
          totalExpenses += Number(row.amount);
        }
      });

      const totalBalance = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

      return res.json({
        totalBalance,
        totalIncome,
        totalExpenses,
        savingsRate,
        transactionCount: rows.length
      });
    }
  );
};
