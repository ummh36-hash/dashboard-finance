const API_BASE = '/api';

export const api = {
  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  },

  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  },

  async getProfile(token) {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch (err) {
      throw err;
    }
  },

  // Transactions
  async getTransactions(token) {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return await res.json();
    } catch (err) {
      throw err;
    }
  },

  async addTransaction(transaction, token) {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add transaction');
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  },

  async deleteTransaction(id, token) {
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      return await res.json();
    } catch (err) {
      throw err;
    }
  }
};
