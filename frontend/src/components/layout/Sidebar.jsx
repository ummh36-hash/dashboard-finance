import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PlusCircle, 
  User, 
  LogOut, 
  TrendingUp, 
  ShieldCheck, 
  X,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'add-transaction', label: 'Add Transaction', icon: PlusCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNav = (pageId) => {
    setActivePage(pageId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0A1210] border-r border-[#1B352E] 
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div>
          <div className="p-6 flex items-center justify-between border-b border-[#1B352E]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00E599] to-[#0B5E46] flex items-center justify-center shadow-lg shadow-[#00E599]/20">
                <CreditCard className="w-5 h-5 text-black font-bold" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  KIMI <span className="text-[#00E599] font-mono">FINANCE</span>
                </h1>
                <p className="text-xs text-[#8FA8A1]">Intelligent Asset Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#162923]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Balance Preview Badge */}
          <div className="mx-4 mt-5 p-3.5 rounded-xl bg-gradient-to-br from-[#10241E] to-[#0D1C18] border border-[#20433A]/80 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8FA8A1] uppercase tracking-wider">Account Mode</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00E599] bg-[#00E599]/10 px-2 py-0.5 rounded-full border border-[#00E599]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse"></span> Live Sync
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-300">
              Personal Vault &middot; <span className="text-white font-medium">{user?.currency || 'USD ($)'}</span>
            </p>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 px-3 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#5A7A71]">
              Main Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`
                    w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#00E599] to-[#05C682] text-[#07130F] font-bold shadow-lg shadow-[#00E599]/25 translate-x-1' 
                      : 'text-gray-300 hover:text-white hover:bg-[#142621] hover:border-[#23473D]'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#07130F]' : 'text-[#8FA8A1]'}`} />
                  <span>{item.label}</span>
                  {item.id === 'add-transaction' && (
                    <span className={`ml-auto text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-black/20 text-[#07130F]' : 'bg-[#00E599]/15 text-[#00E599]'
                    }`}>
                      + New
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-[#1B352E]/60 bg-[#070E0C]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#10221C] border border-[#1E3E34] mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#00E599]/20 border border-[#00E599]/40 flex items-center justify-center text-[#00E599] font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'KIMI User'}</p>
              <p className="text-xs text-[#8FA8A1] truncate">{user?.email || 'user@kimi.io'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-rose-950/20 border border-rose-900/40 hover:bg-rose-900/30 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
