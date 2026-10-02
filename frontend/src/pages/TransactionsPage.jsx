import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronDown,
  Download,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { getCategoryIcon } from '../components/dashboard/RecentTransactions';

export const TransactionsPage = ({ onNavigate }) => {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'INCOME' | 'EXPENSE'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'amount-high' | 'amount-low'
  const [deletingId, setDeletingId] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(transactions.map(t => t.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [transactions]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch = 
          (tx.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = 
          typeFilter === 'ALL' ? true : tx.type.toUpperCase() === typeFilter;
        
        const matchesCategory = 
          selectedCategory === 'ALL' ? true : tx.category === selectedCategory;

        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-high') return Number(b.amount) - Number(a.amount);
        if (sortBy === 'amount-low') return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [transactions, searchTerm, typeFilter, selectedCategory, sortBy]);

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeletingId(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Category', 'Description', 'Date'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.type,
      t.amount,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kimi_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Ledger & Transaction Records</h2>
          <p className="text-sm text-[#8FA8A1] mt-0.5">
            Showing {filteredTransactions.length} of {transactions.length} entries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F231D] border border-[#21493D] text-[#A6C5BD] text-xs font-semibold hover:text-white hover:bg-[#16362D] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#00E599]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigate('add-transaction')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E599] text-[#07130F] font-bold text-sm shadow-lg shadow-[#00E599]/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1C18] border border-[#1B3A31] shadow-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60857B]" />
            <input
              type="text"
              placeholder="Search description, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#081310] border border-[#18362D] text-white text-sm placeholder-[#55756C] focus:outline-none focus:border-[#00E599] transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#081310] border border-[#18362D] text-white text-sm focus:outline-none focus:border-[#00E599] transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0A1613]">
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#081310] border border-[#18362D] text-white text-sm focus:outline-none focus:border-[#00E599] transition-colors cursor-pointer"
            >
              <option value="date-desc" className="bg-[#0A1613]">Newest First</option>
              <option value="date-asc" className="bg-[#0A1613]">Oldest First</option>
              <option value="amount-high" className="bg-[#0A1613]">Highest Amount</option>
              <option value="amount-low" className="bg-[#0A1613]">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#16332A]">
          <span className="text-xs font-semibold text-[#668B81] mr-1">Type:</span>
          {['ALL', 'INCOME', 'EXPENSE'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === t
                  ? 'bg-[#00E599] text-[#07130F] font-bold shadow'
                  : 'bg-[#091512] text-[#8FA8A1] border border-[#163028] hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'All Types' : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="rounded-2xl bg-[#0D1C18] border border-[#1B3A31] overflow-hidden shadow-xl">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Receipt className="w-12 h-12 mx-auto text-[#486B62] mb-3" />
            <h4 className="text-base font-semibold text-white">No transactions match your criteria</h4>
            <p className="text-xs text-[#8FA8A1] mt-1">Try clearing your filters or searching for something else.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#18362D] bg-[#091512] text-xs font-bold uppercase tracking-wider text-[#688E84]">
                  <th className="py-3.5 px-4 sm:px-6">Description & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152E26] text-sm">
                {filteredTransactions.map((tx) => {
                  const Icon = getCategoryIcon(tx.category);
                  const isIncome = tx.type.toLowerCase() === 'income';

                  return (
                    <tr 
                      key={tx.id}
                      className="hover:bg-[#10241F]/60 transition-colors group"
                    >
                      {/* Description with Icon */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isIncome 
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                              : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-[#00E599] transition-colors">
                              {tx.description || tx.category}
                            </p>
                            <span className="text-xs text-[#7B9E95] sm:hidden">
                              {tx.category} &middot; {tx.date}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#112620] text-[#A6C5BD] text-xs font-medium border border-[#193A30]">
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-[#8FA8A1] font-mono hidden sm:table-cell">
                        {tx.date}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-right font-mono font-bold">
                        <span className={isIncome ? 'text-[#00E599]' : 'text-rose-400'}>
                          {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setDeletingId(tx.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#0E1F1A] border border-[#234A3E] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Transaction?</h3>
                <p className="text-xs text-[#8FA8A1]">This record will be permanently removed from your ledger.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-[#142923] text-gray-300 text-xs font-semibold hover:bg-[#1B362E] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
