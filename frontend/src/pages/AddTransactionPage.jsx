import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investments', 'Dividends', 'Business', 'Bonus', 'Gift', 'Other Income'
];

const EXPENSE_CATEGORIES = [
  'Housing', 'Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 
  'Utilities', 'Healthcare', 'Education', 'Personal Care', 'Travel', 'Other Expense'
];

export const AddTransactionPage = ({ onNavigate }) => {
  const { addTransaction } = useFinance();
  const [type, setType] = useState('Expense'); // 'Income' | 'Expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleQuickAmount = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than $0.');
      return;
    }

    if (!category) {
      setError('Please select a valid transaction category.');
      return;
    }

    setSubmitting(true);

    try {
      await addTransaction({
        type,
        amount: parsedAmount,
        category,
        description: description.trim() || category,
        date: date || new Date().toISOString().split('T')[0]
      });

      setSuccess(true);
      setAmount('');
      setDescription('');
      
      // Auto navigate after short delay or let user choose
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to record transaction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Record New Transaction</h2>
        <p className="text-sm text-[#8FA8A1] mt-0.5">
          Enter incoming revenue or log an expense in your vault
        </p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl bg-[#0D1C18] border border-[#1B3A31] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E599]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#00E599] shrink-0" />
            <div className="text-sm">
              <span className="font-bold text-white">Transaction Recorded Successfully!</span> Redirecting to your dashboard...
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Transaction Type Toggle (Income / Expense) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-2.5">
              Transaction Flow
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-xl bg-[#081310] border border-[#17352D]">
              <button
                type="button"
                onClick={() => handleTypeChange('Income')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                  type === 'Income'
                    ? 'bg-[#00E599] text-[#07130F] shadow-lg shadow-[#00E599]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                <span>Income (+)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('Expense')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                  type === 'Expense'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 stroke-[3]" />
                <span>Expense (-)</span>
              </button>
            </div>
          </div>

          {/* 2. Amount Input with Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-2">
              Amount ($ USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#00E599] font-mono">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#081310] border border-[#19372E] text-white text-2xl font-bold font-mono placeholder-[#3A564F] focus:outline-none focus:border-[#00E599] transition-colors"
              />
            </div>

            {/* Quick Increment Presets */}
            <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
              <span className="text-[11px] text-[#6A8E84] shrink-0">Quick add:</span>
              {[25, 50, 100, 250, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="px-2.5 py-1 rounded-lg bg-[#0E201B] border border-[#1A3A31] text-[11px] font-mono font-medium text-[#A6C5BD] hover:text-[#00E599] hover:border-[#00E599]/40 transition-colors shrink-0"
                >
                  +${val}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#081310] border border-[#19372E] text-white text-sm focus:outline-none focus:border-[#00E599] transition-colors cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0A1613]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Description Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-2">
              Description / Memo (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly cloud hosting, groceries at Whole Foods..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#081310] border border-[#19372E] text-white text-sm placeholder-[#4B6860] focus:outline-none focus:border-[#00E599] transition-colors"
            />
          </div>

          {/* 5. Date Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-2">
              Transaction Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#081310] border border-[#19372E] text-white text-sm focus:outline-none focus:border-[#00E599] transition-colors cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-3.5 rounded-xl bg-[#10241E] border border-[#1B3E33] text-gray-300 font-semibold text-sm hover:bg-[#163028] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                type === 'Income'
                  ? 'bg-[#00E599] text-[#07130F] shadow-[#00E599]/20 hover:brightness-110'
                  : 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-rose-600/20 hover:brightness-110'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>{submitting ? 'Saving Transaction...' : `Save ${type} Entry`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
