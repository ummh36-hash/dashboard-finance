import React from 'react';
import { Menu, Plus, Bell, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';

export const Header = ({ activePage, setActivePage, setIsMobileOpen }) => {
  const { user } = useAuth();
  const { totalBalance } = useFinance();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return { title: 'Dashboard Overview', desc: 'Real-time financial performance & metrics' };
      case 'transactions':
        return { title: 'Transactions History', desc: 'Manage, filter and review cash flows' };
      case 'add-transaction':
        return { title: 'New Transaction', desc: 'Record incoming revenue or outgoing expenses' };
      case 'profile':
        return { title: 'User Profile & Settings', desc: 'Manage your personal preferences & vault' };
      default:
        return { title: 'KIMI Finance', desc: 'Personal finance analytics' };
    }
  };

  const { title, desc } = getPageTitle();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-[#070D0B]/85 backdrop-blur-md border-b border-[#1B352E] px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-[#12241F] border border-[#1E3E34] text-gray-300 hover:text-white"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-[#8FA8A1] hidden sm:block">
              {desc}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Stats, Date, Quick Add */}
        <div className="flex items-center gap-3">
          {/* Today Date Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1E1A] border border-[#1D3C33] text-xs text-[#A1BDB6]">
            <Calendar className="w-3.5 h-3.5 text-[#00E599]" />
            <span>{today}</span>
          </div>

          {/* Balance Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0C241E] to-[#123129] border border-[#20493E]">
            <span className="text-[11px] font-semibold text-[#8FA8A1] uppercase tracking-wider">Net:</span>
            <span className={`text-sm font-bold font-mono ${totalBalance >= 0 ? 'text-[#00E599]' : 'text-rose-400'}`}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Quick Add Button */}
          {activePage !== 'add-transaction' && (
            <button
              onClick={() => setActivePage('add-transaction')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E599] to-[#05C682] text-[#07130F] font-bold text-xs sm:text-sm shadow-lg shadow-[#00E599]/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}

          {/* User Avatar */}
          <button
            onClick={() => setActivePage('profile')}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#143027] to-[#1C4437] border border-[#2A5C4F] flex items-center justify-center text-white font-bold text-sm hover:border-[#00E599] transition-colors"
            title="View Profile"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </button>
        </div>
      </div>
    </header>
  );
};
