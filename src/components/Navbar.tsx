import React from 'react';
import { Shield, Lock, ArrowRight, UserCheck, Building2, LogOut, ChevronDown } from 'lucide-react';
import { UserProfile } from '../lib/types.ts';
import { ADMIN_CREDENTIALS } from '../lib/constants.ts';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenAuth: (initialMode?: 'signin' | 'register') => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateDashboard?: () => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigateHome,
  onNavigateDashboard,
  onOpenChat,
}) => {
  const isAdmin = currentUser?.email === ADMIN_CREDENTIALS.email;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Veritas Secure Gateway • 256-bit Encrypted
          </span>
          <span className="hidden md:inline text-slate-400">•</span>
          <span className="hidden md:inline text-slate-300">FDIC Insured up to $250,000 per depositor</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={onOpenChat}>
            24/7 Live Concierge
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">Global Routing: 021000021</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-800 flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">VERITAS</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider">ONLINE</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 tracking-wide">NATIONAL BANK & TRUST</p>
          </div>
        </div>

        {/* Public Nav Links (Hidden on small screens) */}
        {!currentUser && (
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#accounts" className="hover:text-emerald-700 transition-colors">Personal Banking</a>
            <a href="#transfers" className="hover:text-emerald-700 transition-colors">Global Transfers</a>
            <a href="#security" className="hover:text-emerald-700 transition-colors">Security & Protection</a>
            <a href="#rates" className="hover:text-emerald-700 transition-colors">Rates & Yields</a>
            <a href="#calculator" className="hover:text-emerald-700 transition-colors">Wire Calculator</a>
          </nav>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-semibold">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Executive Operator Console</span>
                </div>
              ) : (
                <button
                  onClick={onNavigateDashboard}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>My Accounts</span>
                </button>
              )}

              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.fullName}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isAdmin ? 'System Administrator' : `Checking ...${currentUser.checkingAccountNumber}`}
                </p>
              </div>

              <button
                onClick={onLogout}
                title="Sign off"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Off</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/20 hover:shadow-slate-900/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Open Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
