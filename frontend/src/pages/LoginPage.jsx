import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleFillDemo = () => {
    setEmail('alex.kimi@finance.io');
    setPassword('kimi123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#070D0B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00E599]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0B2B26]/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E599] to-[#0B5E46] shadow-xl shadow-[#00E599]/25 mb-4">
          <CreditCard className="w-7 h-7 text-black font-bold" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          KIMI <span className="text-[#00E599] font-mono">FINANCE</span>
        </h2>
        <p className="mt-2 text-sm text-[#8FA8A1]">
          Sign in to access your intelligent wealth dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-2xl bg-[#0D1C18] border border-[#1B3A31] p-6 sm:p-8 shadow-2xl relative">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#53766D]" />
                <input
                  type="email"
                  placeholder="alex.kimi@finance.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#081310] border border-[#18362D] text-white text-sm placeholder-[#415F56] focus:outline-none focus:border-[#00E599] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1]">
                  Password
                </label>
                <span className="text-xs text-[#00E599] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#53766D]" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#081310] border border-[#18362D] text-white text-sm placeholder-[#415F56] focus:outline-none focus:border-[#00E599] transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#00E599] to-[#05C682] text-[#07130F] font-bold text-sm shadow-lg shadow-[#00E599]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-[#18362D] text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11241F] border border-[#1F453B] text-xs font-semibold text-[#00E599] hover:bg-[#18372F] transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fill Demo Credentials</span>
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <p className="mt-6 text-center text-sm text-[#8FA8A1]">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-[#00E599] hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};
