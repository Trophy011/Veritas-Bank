import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Heart, 
  LogOut, 
  ChevronRight, 
  Gauge, 
  Home, 
  ArrowDownToLine, 
  ArrowLeftRight, 
  Compass, 
  Menu as MenuIcon, 
  AlertTriangle, 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  PlusCircle, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Headphones, 
  KeyRound, 
  User, 
  Settings, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile, Transaction } from '../lib/types.ts';
import { bankService } from '../lib/bank-service.ts';

interface CustomerDashboardProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onOpenInternalTransfer: () => void;
  onOpenInternationalTransfer: () => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
  onOpenLiveChat: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onLogout,
  onOpenInternalTransfer,
  onOpenInternationalTransfer,
  onOpenDeposit,
  onOpenProfile,
  onOpenLiveChat,
  onSelectTransaction
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'deposit' | 'transfers' | 'explore' | 'menu'>('accounts');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [fannedCard, setFannedCard] = useState<string | null>(null);

  useEffect(() => {
    const loadTx = () => {
      setTransactions(bankService.getUserTransactions(currentUser.uid));
    };
    loadTx();
    const unsub = bankService.subscribe(loadTx);
    return () => unsub();
  }, [currentUser.uid]);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';

  const firstName = currentUser.firstName || currentUser.fullName.split(' ')[0] || 'Client';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100/50 via-slate-50 to-amber-50/30 text-slate-900 pb-28">
      
      {/* Top Mobile Status Header Bar */}
      <div className="max-w-md mx-auto pt-6 px-5 flex justify-between items-center">
        {/* Left: subtle brand badge */}
        <span className="text-xs font-bold text-slate-500 tracking-tight flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Veritas Mobile
        </span>

        {/* Right action icons (as seen in screenshot: Bell with badge 1, Heart, Sign off) */}
        <div className="flex items-center gap-4 text-slate-700">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-1 hover:text-slate-900 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {currentUser.warningMessage ? '!' : '1'}
            </span>
          </button>

          <button
            onClick={() => setShowRewardsModal(true)}
            className="w-7 h-7 rounded-full bg-slate-400/20 flex items-center justify-center hover:bg-slate-400/30 transition-colors cursor-pointer"
            title="Favorites & Rewards"
          >
            <Heart className="w-4 h-4 text-slate-700 fill-slate-700" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-rose-600 transition-colors cursor-pointer"
            title="Sign off"
          >
            <span className="text-xs">Sign off</span>
            <LogOut className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="max-w-md mx-auto px-5 pt-4 space-y-4">
        
        {/* NOTIFICATIONS DROPDOWN / BANNER */}
        {notificationOpen && (
          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200 animate-in fade-in space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">Account Notifications</span>
              <button onClick={() => setNotificationOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs space-y-2 text-slate-700">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-900">Welcome to Veritas Online Banking</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Your accounts are protected under FDIC Insurance up to $250,000.</p>
              </div>
              {currentUser.warningMessage && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <p className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Notice from Bank Management:
                  </p>
                  <p className="text-[11px] mt-0.5">{currentUser.warningMessage}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADMIN WARNING MESSAGE BANNER */}
        {currentUser.warningMessage && (
          <div className={`p-4 rounded-2xl shadow-sm border flex items-start gap-3 ${
            currentUser.warningLevel === 'critical'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : currentUser.warningLevel === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
              currentUser.warningLevel === 'critical' ? 'text-rose-600' : 'text-amber-600'
            }`} />
            <div className="text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-wide uppercase text-[10px]">
                  Official Veritas Management Alert
                </span>
                <span className="text-[10px] font-semibold opacity-75">Action Required</span>
              </div>
              <p className="text-sm font-semibold mt-1 leading-snug">
                {currentUser.warningMessage}
              </p>
              <button
                onClick={onOpenLiveChat}
                className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
              >
                Respond to Bank Concierge Support →
              </button>
            </div>
          </div>
        )}

        {/* ACCOUNT LOCKED BANNER */}
        {currentUser.isLocked && (
          <div className="p-4 rounded-2xl bg-rose-900 text-white shadow-md flex items-start gap-3">
            <Lock className="w-5 h-5 shrink-0 text-rose-300 mt-0.5" />
            <div className="text-xs flex-1">
              <span className="font-bold text-rose-200 uppercase text-[10px] tracking-wider">Account Locked</span>
              <p className="text-sm font-bold mt-0.5">Your Veritas account operations have been locked by Bank Management.</p>
              <p className="text-[11px] text-rose-200 mt-1">Outgoing transfers and deposits are paused. Please contact live customer support.</p>
              <button
                onClick={onOpenLiveChat}
                className="mt-2.5 px-3 py-1.5 rounded-lg bg-white text-rose-950 font-bold text-xs hover:bg-rose-50 cursor-pointer"
              >
                Contact Support Desk
              </button>
            </div>
          </div>
        )}

        {/* TRANSFER RESTRICTION BANNER */}
        {currentUser.isTransferRestricted && !currentUser.isLocked && (
          <div className="p-3.5 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Outgoing Transfers Restricted</p>
              <p className="text-[11px] text-amber-900">Transfers are temporarily restricted for compliance review. Contact support to verify your account.</p>
            </div>
          </div>
        )}

        {/* ACCOUNTS VIEW (Matches Uploaded Screenshot) */}
        {activeTab === 'accounts' && (
          <div className="space-y-3.5">
            {/* Greeting Header (as seen in screenshot: "Good evening,", "Ramyia") */}
            <div className="pt-1">
              <p className="text-xl sm:text-2xl text-slate-700 font-normal leading-tight">
                {greeting}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {firstName}
              </h2>

              {/* Rewards banner link */}
              <button
                onClick={() => setShowRewardsModal(true)}
                className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <span>Veritas Rewards® ${currentUser.cashRewards.toFixed(2)} cash rewards</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* CARD 1: EVERYDAY CHECKING */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 hover:shadow-sm transition-all">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  EVERYDAY CHECKING ...{currentUser.checkingAccountNumber}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                  Primary
                </span>
              </div>
              
              <div className="mt-2.5">
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                  ${currentUser.checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Available balance
                </p>
              </div>

              {/* Action buttons inside card */}
              <div className="flex gap-2 pt-4 mt-3 border-t border-slate-100">
                <button
                  onClick={onOpenInternalTransfer}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transfer</span>
                </button>
                <button
                  onClick={onOpenDeposit}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-slate-600" />
                  <span>Deposit</span>
                </button>
              </div>
            </div>

            {/* CARD 2: WAY2SAVE® SAVINGS */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 hover:shadow-sm transition-all">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  WAY2SAVE® SAVINGS ...{currentUser.savingsAccountNumber}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                  5.15% APY
                </span>
              </div>

              <div className="mt-2.5">
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                  ${currentUser.savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Available balance
                </p>
              </div>

              <div className="flex gap-2 pt-4 mt-3 border-t border-slate-100">
                <button
                  onClick={onOpenInternalTransfer}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Move Funds</span>
                </button>
                <button
                  onClick={onOpenDeposit}
                  className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Grow Savings</span>
                </button>
              </div>
            </div>

            {/* CARD 3: PLATINUM CARD */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 hover:shadow-sm transition-all">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  PLATINUM CARD ...{currentUser.cardAccountNumber}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 font-bold">
                  Credit
                </span>
              </div>

              <div className="mt-2.5">
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                  ${currentUser.cardBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Outstanding balance
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Available Credit Limit:</span>
                <span className="font-bold text-slate-900">${(currentUser.cardLimit - currentUser.cardBalance).toLocaleString()}</span>
              </div>
            </div>

            {/* CTA Pill button: Open a new account (Exact match to screenshot) */}
            <div className="pt-2 pb-1 text-center">
              <button
                onClick={() => setShowOpenAccountModal(true)}
                className="w-full sm:w-auto px-8 py-3 rounded-full border border-slate-300 bg-white/90 hover:bg-white text-sm font-bold text-slate-900 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                Open a new account
              </button>
            </div>

            {/* Credit Close-Up Card (Exact match to screenshot) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center gap-3.5 hover:shadow-sm transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Gauge className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  Monitor your FICO® Score and credit report with Credit Close-Up℠
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-emerald-700">{currentUser.creditScore}</span>
                  <span className="text-[11px] font-semibold text-slate-500">Excellent • Verified by Experian</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Recent Account Activity Feed */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Account Transactions
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700">Live Ledger</span>
              </div>

              {transactions.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No transaction records found yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {transactions.slice(0, 5).map(tx => {
                    const isCredit = tx.recipientUid === currentUser.uid || tx.type === 'deposit' || tx.type === 'admin_fund';
                    const isReversed = tx.status === 'reversed';

                    return (
                      <div
                        key={tx.id}
                        onClick={() => onSelectTransaction(tx)}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isReversed
                              ? 'bg-slate-100 text-slate-400 line-through'
                              : isCredit
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className={`font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[200px] ${isReversed ? 'line-through text-slate-400' : ''}`}>
                              {tx.memo || (isCredit ? tx.senderName : tx.recipientName)}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {tx.type.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`font-black text-sm ${
                            isReversed
                              ? 'text-slate-400 line-through'
                              : isCredit
                              ? 'text-emerald-600'
                              : 'text-slate-900'
                          }`}>
                            {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                          </p>
                          <span className={`text-[10px] font-bold uppercase ${
                            isReversed ? 'text-rose-500' : 'text-slate-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* PAY & TRANSFER VIEW */}
        {activeTab === 'transfers' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Capital Movements & Transfers</h3>
              <p className="text-xs text-slate-500">Dispatch domestic bank transfers or worldwide SWIFT international wires.</p>
            </div>

            <div className="space-y-3">
              {/* Internal Transfer Card */}
              <div 
                onClick={onOpenInternalTransfer}
                className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Internal Bank Transfer</h4>
                    <p className="text-xs text-slate-500">Send money instantly to any Veritas account holder</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

              {/* International Transfer Card */}
              <div 
                onClick={onOpenInternationalTransfer}
                className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">International SWIFT Wire</h4>
                    <p className="text-xs text-slate-500">Wire to 30+ nations with direct commercial bank routing</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* DEPOSIT VIEW */}
        {activeTab === 'deposit' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Deposit Funds</h3>
              <p className="text-xs text-slate-500">Instant check deposit simulation or wire credit.</p>
            </div>

            <div 
              onClick={onOpenDeposit}
              className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 hover:border-emerald-500 text-center space-y-3 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <ArrowDownToLine className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Mobile Check Deposit</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Capture the front and back of your check to clear funds into Checking or Way2Save Savings.
              </p>
              <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs">
                Launch Camera / Deposit Check
              </button>
            </div>
          </div>
        )}

        {/* EXPLORE VIEW */}
        {activeTab === 'explore' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Explore Veritas Wealth</h3>
              <p className="text-slate-500">Access premium lending, high-yield CDs, and treasury products.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Certificate of Deposit (CD)</p>
                  <p className="text-slate-500">Lock in 5.35% APY for 12 months with fixed yield.</p>
                </div>
                <button onClick={() => setShowOpenAccountModal(true)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold cursor-pointer">
                  Open
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Platinum Rewards Card</p>
                  <p className="text-slate-500">3% unlimited cash back on dining and travel worldwide.</p>
                </div>
                <button onClick={() => setShowOpenAccountModal(true)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold cursor-pointer">
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MENU VIEW */}
        {activeTab === 'menu' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                  {firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{currentUser.fullName}</h3>
                  <p className="text-slate-500">{currentUser.email}</p>
                  <p className="text-[11px] font-mono text-emerald-700">ID: {currentUser.uid}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-100 divide-y divide-slate-100 overflow-hidden font-semibold text-slate-800">
              <button
                onClick={onOpenProfile}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Personal Profile & Contact Info</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onOpenProfile}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <span>Setup / Change 4-Digit Security PIN</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onOpenLiveChat}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-900 font-bold">24/7 Live Concierge Banker Chat</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Online
                </span>
              </button>

              <button
                onClick={onLogout}
                className="w-full p-4 flex items-center justify-between hover:bg-rose-50 text-rose-600 cursor-pointer text-left font-bold"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Off From Veritas</span>
                </div>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FIXED BOTTOM NAVIGATION (Directly matching screenshot) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-lg max-w-md mx-auto">
        <div className="flex justify-around items-center h-16 px-2 text-[10px] font-bold">
          
          {/* Accounts (Home) */}
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              activeTab === 'accounts' ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5 fill-current" />
            <span>Accounts</span>
          </button>

          {/* Deposit */}
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              activeTab === 'deposit' ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownToLine className="w-5 h-5" />
            <span>Deposit</span>
          </button>

          {/* Pay & Transfer */}
          <button
            onClick={() => setActiveTab('transfers')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              activeTab === 'transfers' ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span>Pay & Transfer</span>
          </button>

          {/* Explore */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              activeTab === 'explore' ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Explore</span>
          </button>

          {/* Menu */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              activeTab === 'menu' ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MenuIcon className="w-5 h-5" />
            <span>Menu</span>
          </button>

        </div>
      </nav>

      {/* Rewards Details Modal */}
      {showRewardsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900">Veritas Rewards®</span>
              <button onClick={() => setShowRewardsModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-4 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-500 font-medium">Available Cash Rewards</p>
              <p className="text-4xl font-black text-slate-900 mt-1">${currentUser.cashRewards.toFixed(2)}</p>
              <p className="text-xs text-emerald-700 font-bold mt-1">Ready for instant account credit</p>
            </div>
            <button
              onClick={() => {
                bankService.depositFunds(currentUser.uid, 'checking', currentUser.cashRewards, 'Veritas Cash Rewards Redemption');
                bankService.updateProfile(currentUser.uid, { cashRewards: 0 });
                setShowRewardsModal(false);
              }}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              Redeem to Checking Account
            </button>
          </div>
        </div>
      )}

      {/* Open New Account Modal */}
      {showOpenAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900">Open a New Veritas Account</span>
              <button onClick={() => setShowOpenAccountModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500">Expand your Veritas relationship with guaranteed FDIC coverage.</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  alert('High-Yield Certificate of Deposit account initiated with 5.35% APY.');
                  setShowOpenAccountModal(false);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 font-semibold cursor-pointer"
              >
                <p className="font-bold text-slate-900">12-Month High-Yield CD</p>
                <p className="text-[11px] text-slate-500">5.35% APY guaranteed yield</p>
              </button>
              <button
                onClick={() => {
                  alert('Business Digital Checking account added to your profile.');
                  setShowOpenAccountModal(false);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 font-semibold cursor-pointer"
              >
                <p className="font-bold text-slate-900">Business Checking Sub-Account</p>
                <p className="text-[11px] text-slate-500">Unlimited invoicing & wires</p>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
