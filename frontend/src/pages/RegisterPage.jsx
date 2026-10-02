import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register(name.trim(), email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070D0B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#00E599]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0B2B26]/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E599] to-[#0B5E46] shadow-xl shadow-[#00E599]/25 mb-4">
          <CreditCard className="w-7 h-7 text-black font-bold" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Create KIMI Account
        </h2>
        <p className="mt-2 text-sm text-[#8FA8A1]">
          Start managing your personal cash flows with precision
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
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#53766D]" />
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#081310] border border-[#18362D] text-white text-sm placeholder-[#415F56] focus:outline-none focus:border-[#00E599] transition-colors"
                />
              </div>
            </div>

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
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#53766D]" />
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#081310] border border-[#18362D] text-white text-sm placeholder-[#415F56] focus:outline-none focus:border-[#00E599] transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8FA8A1] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#53766D]" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>{loading ? 'Creating Account...' : 'Get Started with KIMI'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-[#8FA8A1]">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-[#00E599] hover:underline"
          >
            Sign in instead
          </button>
        </p>
      </div>
    </div>
  );
};
