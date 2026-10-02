import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  Area,
  ComposedChart,
  Line
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';

export const CashFlowChart = () => {
  const { monthlyCashFlowData } = useFinance();
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'composed'

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A1613] border border-[#20493E] p-3.5 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-gray-300 mb-2">{label} Financial Breakdown</p>
          <div className="space-y-1 text-xs font-mono">
            <p className="text-[#00E599] flex items-center justify-between gap-4">
              <span>Income:</span>
              <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span>
            </p>
            <p className="text-rose-400 flex items-center justify-between gap-4">
              <span>Expenses:</span>
              <span className="font-bold">${payload[1]?.value?.toLocaleString()}</span>
            </p>
            {payload[2] && (
              <p className="text-sky-400 flex items-center justify-between gap-4 pt-1 border-t border-[#1C3B32]">
                <span>Net Flow:</span>
                <span className="font-bold">${payload[2]?.value?.toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#0D1C18] border border-[#1B3A31] p-5 sm:p-6 shadow-xl mb-8">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#00E599]/15 text-[#00E599]">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Cash Flow Dynamics</h3>
          </div>
          <p className="text-xs text-[#8FA8A1] mt-0.5">
            Income vs Expenses progression over recent periods
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#081310] border border-[#18352C] self-start sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-[#00E599] text-[#07130F] font-bold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bars
          </button>
          <button
            onClick={() => setChartType('composed')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              chartType === 'composed'
                ? 'bg-[#00E599] text-[#07130F] font-bold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trend Analysis
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={monthlyCashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162E27" vertical={false} />
              <XAxis dataKey="month" stroke="#688B82" fontSize={12} tickLine={false} />
              <YAxis stroke="#688B82" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#00E599" radius={[6, 6, 0, 0]} maxBarSize={38} />
              <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={38} />
            </BarChart>
          ) : (
            <ComposedChart data={monthlyCashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E599" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00E599" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#162E27" vertical={false} />
              <XAxis dataKey="month" stroke="#688B82" fontSize={12} tickLine={false} />
              <YAxis stroke="#688B82" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" fill="url(#incomeGrad)" stroke="#00E599" strokeWidth={2.5} />
              <Line type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 4 }} />
              <Line type="monotone" dataKey="net" name="Net Flow" stroke="#38BDF8" strokeWidth={2} strokeDasharray="4 4" />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 mt-2 border-t border-[#18362D] text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00E599]"></div>
          <span className="text-gray-300 font-medium">Income Streams</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-gray-300 font-medium">Expenses & Outflows</span>
        </div>
        {chartType === 'composed' && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-400"></div>
            <span className="text-gray-300 font-medium">Net Surplus</span>
          </div>
        )}
      </div>
    </div>
  );
};
