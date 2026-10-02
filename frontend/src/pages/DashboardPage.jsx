import React from 'react';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  ShieldCheck, 
  PieChart as PieIcon,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';

export const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { totalBalance, totalIncome, totalExpenses } = useFinance();

  const budgetProgress = Math.min(Math.round((totalExpenses / 5000) * 100), 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C241E] via-[#0E2D25] to-[#0A1D18] border border-[#20493E] p-6 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00E599]/15 via-transparent to-transparent pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E599]/10 border border-[#00E599]/25 text-[#00E599] text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Financial Tracking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Alex'}!
            </h2>
            <p className="text-sm text-[#8FA8A1] mt-1 max-w-xl">
              Your personal net cash flow is healthy. You have saved <span className="text-[#00E599] font-bold">${Math.max(0, totalBalance).toFixed(2)}</span> this period.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('add-transaction')}
              className="px-4 py-2.5 rounded-xl bg-[#00E599] text-[#07130F] font-bold text-sm shadow-lg shadow-[#00E599]/20 hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>+ Add Transaction</span>
            </button>
            <button
              onClick={() => onNavigate('transactions')}
              className="px-4 py-2.5 rounded-xl bg-[#132A23] border border-[#214B3E] text-white font-semibold text-sm hover:bg-[#1A3830] transition-colors inline-flex items-center gap-2"
            >
              <span>View Ledger</span>
              <ArrowRight className="w-4 h-4 text-[#00E599]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <SummaryCards onAddTransactionClick={() => onNavigate('add-transaction')} />

      {/* Main Grid: Cash Flow Chart + Sidebar widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart (Span 2) */}
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>

        {/* Monthly Budget & Financial Health Widget (Span 1) */}
        <div className="space-y-6">
          {/* Budget Widget */}
          <div className="rounded-2xl bg-[#0D1C18] border border-[#1B3A31] p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#00E599]" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Monthly Budget Cap</h4>
              </div>
              <span className="text-xs font-mono font-bold text-[#8FA8A1]">${totalExpenses.toFixed(0)} / $5,000</span>
            </div>
            
            <div className="w-full bg-[#081310] rounded-full h-2.5 overflow-hidden border border-[#19372F]">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  budgetProgress > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#00E599] to-emerald-400'
                }`}
                style={{ width: `${budgetProgress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#8FA8A1] mt-2">
              <span>{budgetProgress}% consumed</span>
              <span className="text-emerald-400 font-medium">${Math.max(0, 5000 - totalExpenses).toFixed(0)} remaining</span>
            </div>
          </div>

          {/* Security & Verification Badge */}
          <div className="rounded-2xl bg-gradient-to-br from-[#091512] to-[#0D211B] border border-[#1C4136] p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#00E599]/15 text-[#00E599]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Encrypted Vault Storage</h4>
                <p className="text-xs text-[#8FA8A1] mt-1">
                  All personal transactions are securely stored and synchronized in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <RecentTransactions onNavigate={onNavigate} />
    </div>
  );
};
