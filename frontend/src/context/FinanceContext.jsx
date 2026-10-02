import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext(null);

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    userId: 1,
    type: 'Income',
    amount: 5800.00,
    category: 'Salary',
    description: 'Tech Lead Monthly Salary',
    date: '2026-09-01'
  },
  {
    id: 'tx-2',
    userId: 1,
    type: 'Income',
    amount: 1450.00,
    category: 'Freelance',
    description: 'Fintech UI/UX Consulting',
    date: '2026-09-05'
  },
  {
    id: 'tx-3',
    userId: 1,
    type: 'Expense',
    amount: 1850.00,
    category: 'Housing',
    description: 'Apartment Rental & Utilities',
    date: '2026-09-03'
  },
  {
    id: 'tx-4',
    userId: 1,
    type: 'Expense',
    amount: 340.50,
    category: 'Food & Dining',
    description: 'Weekly Organic Groceries & Dining',
    date: '2026-09-07'
  },
  {
    id: 'tx-5',
    userId: 1,
    type: 'Expense',
    amount: 120.00,
    category: 'Transportation',
    description: 'EV Charging & Metro Pass',
    date: '2026-09-08'
  },
  {
    id: 'tx-6',
    userId: 1,
    type: 'Income',
    amount: 420.00,
    category: 'Investments',
    description: 'Dividend Yield - High Growth ETF',
    date: '2026-09-10'
  },
  {
    id: 'tx-7',
    userId: 1,
    type: 'Expense',
    amount: 215.00,
    category: 'Entertainment',
    description: 'Concert & Streaming Subscriptions',
    date: '2026-09-12'
  }
];

export const FinanceProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('kimi_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [loading, setLoading] = useState(false);

  // Sync with API when user/token changes
  useEffect(() => {
    const fetchTx = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await api.getTransactions(token);
        if (Array.isArray(data) && data.length > 0) {
          setTransactions(data);
          localStorage.setItem('kimi_transactions', JSON.stringify(data));
        }
      } catch (err) {
        // Backend not ready yet, keep local state
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [token]);

  // Persist to local storage whenever transactions change
  useEffect(() => {
    localStorage.setItem('kimi_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type.toLowerCase() === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = transactions
    .filter(t => t.type.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const addTransaction = async (newTx) => {
    const transactionObject = {
      id: newTx.id || 'tx-' + Date.now(),
      userId: user?.id || 1,
      type: newTx.type,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      description: newTx.description || '',
      date: newTx.date || new Date().toISOString().split('T')[0]
    };

    // Try backend
    if (token && !token.startsWith('demo-') && !token.startsWith('token-')) {
      try {
        const saved = await api.addTransaction(transactionObject, token);
        if (saved && saved.id) {
          transactionObject.id = saved.id;
        }
      } catch (e) {
        console.warn('Backend save failed, saving locally:', e);
      }
    }

    setTransactions(prev => [transactionObject, ...prev]);
    return transactionObject;
  };

  const deleteTransaction = async (id) => {
    if (token && !token.startsWith('demo-') && !token.startsWith('token-')) {
      try {
        await api.deleteTransaction(id, token);
      } catch (e) {
        console.warn('Backend delete failed, deleting locally:', e);
      }
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Cash flow chart data builder
  const monthlyCashFlowData = [
    { month: 'Apr', income: 4900, expense: 2300, net: 2600 },
    { month: 'May', income: 5200, expense: 2450, net: 2750 },
    { month: 'Jun', income: 5100, expense: 2800, net: 2300 },
    { month: 'Jul', income: 6400, expense: 2900, net: 3500 },
    { month: 'Aug', income: 6100, expense: 2650, net: 3450 },
    { month: 'Sep', income: totalIncome, expense: totalExpenses, net: totalBalance }
  ];

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        totalBalance,
        totalIncome,
        totalExpenses,
        savingsRate,
        addTransaction,
        deleteTransaction,
        monthlyCashFlowData,
        loading
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
