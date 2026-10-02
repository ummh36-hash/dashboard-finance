import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AddTransactionPage } from './pages/AddTransactionPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [authPage, setAuthPage] = useState('login'); // 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D0B] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E599] to-[#0B5E46] flex items-center justify-center animate-pulse mb-4">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-semibold tracking-wider text-[#00E599] font-mono">LOADING KIMI VAULT...</p>
      </div>
    );
  }

  // If user is not authenticated, show Login or Register
  if (!isAuthenticated) {
    if (authPage === 'register') {
      return <RegisterPage onNavigate={(page) => setAuthPage(page)} />;
    }
    return <LoginPage onNavigate={(page) => setAuthPage(page)} />;
  }

  // Authenticated application views
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'transactions':
        return <TransactionsPage onNavigate={setActivePage} />;
      case 'add-transaction':
        return <AddTransactionPage onNavigate={setActivePage} />;
      case 'profile':
        return <ProfilePage onNavigate={setActivePage} />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <FinanceProvider>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {renderActivePage()}
      </Layout>
    </FinanceProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
