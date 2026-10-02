import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  DollarSign, 
  Shield, 
  Target, 
  LogOut, 
  CheckCircle2, 
  Award,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { transactions, totalIncome, totalExpenses, totalBalance } = useFinance();
  const [currency, setCurrency] = useState('USD ($)');
  const [monthlyBudget, setMonthlyBudget] = useState('5000');
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0D2620] via-[#0E2F26] to-[#0A1F19] border border-[#204E42] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#00E599]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00E599] to-[#06805D] p-1 shadow-xl shadow-[#00E599]/20 shrink-0 flex items-center justify-center text-3xl font-extrabold text-[#07130F]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">{user?.name || 'Alex Morgan'}</h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#00E599]/20 text-[#00E599] text-xs font-semibold border border-[#00E599]/40 self-center sm:self-auto">
                Verified Vault Pro
              </span>
            </div>
            <p className="text-sm text-[#8FA8A1] flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-[#00E599]" />
              <span>{user?.email || 'alex.kimi@finance.io'}</span>
            </p>
            <p className="text-xs text-[#6A8E84] flex items-center justify-center sm:justify-start gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Member since {user?.joinedDate || 'January 2026'}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-400 text-xs font-bold hover:bg-rose-900/60 hover:text-rose-200 transition-colors flex items-center gap-2 self-center sm:self-start"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1C18] border border-[#1B3A31] shadow-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8FA8A1] uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-[#00E599]" />
            <span>Total Entries</span>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{transactions.length} Transactions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1C18] border border-[#1B3A31] shadow-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8FA8A1] uppercase tracking-wider mb-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>Lifetime Inflow</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1C18] border border-[#1B3A31] shadow-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8FA8A1] uppercase tracking-wider mb-2">
            <ArrowDownLeft className="w-4 h-4 text-rose-400" />
            <span>Lifetime Outflow</span>
          </div>
          <p className="text-2xl font-extrabold text-rose-400 font-mono">${totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Preferences Form */}
      <div className="rounded-2xl bg-[#0D1C18] border border-[#1B3A31] p-6 sm:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-1">Financial Preferences</h3>
        <p className="text-xs text-[#8FA8A1] mb-6">Customize display units and monthly targets</p>

        {savedStatus && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E599]" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-2">
                Primary Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#081310] border border-[#19372E] text-white text-sm focus:outline-none focus:border-[#00E599] transition-colors"
              >
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="IDR (Rp)">IDR (Rp) - Indonesian Rupiah</option>
                <option value="SGD ($)">SGD ($) - Singapore Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-2">
                Monthly Target Budget ($)
              </label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#081310] border border-[#19372E] text-white text-sm focus:outline-none focus:border-[#00E599] transition-colors font-mono"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00E599] text-[#07130F] font-bold text-sm shadow-lg shadow-[#00E599]/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
