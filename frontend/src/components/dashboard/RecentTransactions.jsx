import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Briefcase, 
  ShoppingBag, 
  Home, 
  Utensils, 
  Car, 
  Film, 
  TrendingUp, 
  Plus, 
  ChevronRight,
  Receipt
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('salary') || cat.includes('wage')) return Briefcase;
  if (cat.includes('food') || cat.includes('dining') || cat.includes('grocer')) return Utensils;
  if (cat.includes('house') || cat.includes('rent') || cat.includes('utility')) return Home;
  if (cat.includes('transport') || cat.includes('car') || cat.includes('fuel')) return Car;
  if (cat.includes('invest') || cat.includes('crypto') || cat.includes('stock')) return TrendingUp;
  if (cat.includes('entertain') || cat.includes('movie') || cat.includes('music')) return Film;
  if (cat.includes('shop') || cat.includes('cloth')) return ShoppingBag;
  return Receipt;
};

export const RecentTransactions = ({ onNavigate }) => {
  const { transactions } = useFinance();
  const recent = transactions.slice(0, 5);

  return (
    <div className="rounded-2xl bg-[#0D1C18] border border-[#1B3A31] p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Recent Activity</span>
            <span className="text-xs font-normal text-[#8FA8A1] bg-[#122721] px-2 py-0.5 rounded-full border border-[#1C3E34]">
              {transactions.length} Total
            </span>
          </h3>
          <p className="text-xs text-[#8FA8A1] mt-0.5">Latest account entries & settlements</p>
        </div>
        <button
          onClick={() => onNavigate('transactions')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#00E599] hover:text-[#25f1ac] hover:underline"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl bg-[#08120F] border border-[#142B24]">
          <Receipt className="w-10 h-10 mx-auto text-[#486B62] mb-3" />
          <p className="text-sm font-medium text-gray-300">No transactions recorded yet</p>
          <p className="text-xs text-[#8FA8A1] mt-1 mb-4">Start tracking your income and expenses effortlessly.</p>
          <button
            onClick={() => onNavigate('add-transaction')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00E599] text-[#07130F] text-xs font-bold shadow-md hover:brightness-110 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Create First Entry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((tx) => {
            const Icon = getCategoryIcon(tx.category);
            const isIncome = tx.type.toLowerCase() === 'income';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-[#091512] border border-[#163028] hover:border-[#224A3E] hover:bg-[#0E1E19] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isIncome 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {tx.description || tx.category}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#8FA8A1] mt-0.5">
                      <span className="bg-[#122822] text-[#A6C5BD] px-2 py-0.5 rounded text-[10px] font-medium border border-[#193930]">
                        {tx.category}
                      </span>
                      <span>&middot;</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className={`text-sm font-bold font-mono ${
                    isIncome ? 'text-[#00E599]' : 'text-rose-400'
                  }`}>
                    {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
