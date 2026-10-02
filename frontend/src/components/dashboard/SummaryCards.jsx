import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const SummaryCards = ({ onAddTransactionClick }) => {
  const { totalBalance, totalIncome, totalExpenses, savingsRate } = useFinance();

  const formatCurrency = (val) => {
    return '$' + Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* 1. Total Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F2620] via-[#0C1E19] to-[#081512] border border-[#214D41] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-[#00E599]/60 hover:shadow-2xl hover:shadow-[#00E599]/10 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E599]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00E599]/20 transition-all"></div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8FA8A1]">Total Balance</span>
          <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            {formatCurrency(totalBalance)}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#00E599] font-medium pt-1">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>+12.4% vs last month</span>
          </div>
        </div>
      </div>

      {/* 2. Income Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D221C] to-[#0A1814] border border-[#1C4439] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-[#00E599]/50 group">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8FA8A1]">Total Income</span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            {formatCurrency(totalIncome)}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Recorded this month</span>
          </div>
        </div>
      </div>

      {/* 3. Expenses Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C1214] to-[#120B0C] border border-[#3E2226] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-rose-500/50 group">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C29B9E]">Total Expenses</span>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            {formatCurrency(totalExpenses)}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium pt-1">
            <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
            <span>Outgoing funds</span>
          </div>
        </div>
      </div>

      {/* 4. Savings Rate / Cash Flow Health Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F221D] to-[#091512] border border-[#1E4338] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-[#00E599]/40 group">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8FA8A1]">Savings Rate</span>
          <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            {savingsRate}%
          </h3>
          <div className="w-full bg-[#132A23] rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#00E599] to-emerald-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-[#8FA8A1] pt-1">Target: 40% monthly</p>
        </div>
      </div>
    </div>
  );
};
