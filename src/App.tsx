import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction } from './lib/types.ts';
import { bankService } from './lib/bank-service.ts';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CustomerDashboard } from './components/CustomerDashboard.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { InternalTransferModal } from './components/InternalTransferModal.tsx';
import { InternationalTransferModal } from './components/InternationalTransferModal.tsx';
import { TransactionReceiptModal } from './components/TransactionReceiptModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { DepositModal } from './components/DepositModal.tsx';
import { LiveSupportChat } from './components/LiveSupportChat.tsx';
import { Headphones } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin');
  
  const [internalTransferOpen, setInternalTransferOpen] = useState(false);
  const [internationalTransferOpen, setInternationalTransferOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(bankService.getCurrentUser());
    };
    syncUser();
    const unsub = bankService.subscribe(syncUser);
    return () => unsub();
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'register' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    bankService.logout();
    setCurrentUser(null);
  };

  const handleTransferSuccess = (tx: Transaction) => {
    setSelectedReceiptTx(tx);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onNavigateHome={() => {}}
        onNavigateDashboard={() => {}}
        onOpenChat={() => setLiveChatOpen(true)}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {!currentUser ? (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onOpenChat={() => setLiveChatOpen(true)}
          />
        ) : isAdmin ? (
          <AdminPortal
            onLogout={handleLogout}
            onSelectTransaction={(tx) => setSelectedReceiptTx(tx)}
          />
        ) : (
          <CustomerDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenInternalTransfer={() => setInternalTransferOpen(true)}
            onOpenInternationalTransfer={() => setInternationalTransferOpen(true)}
            onOpenDeposit={() => setDepositModalOpen(true)}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenLiveChat={() => setLiveChatOpen(true)}
            onSelectTransaction={(tx) => setSelectedReceiptTx(tx)}
          />
        )}
      </div>

      {/* Floating 24/7 Live Support Chat Trigger for customers */}
      {currentUser && !isAdmin && (
        <button
          onClick={() => setLiveChatOpen(true)}
          title="24/7 Veritas Concierge Banker"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/30 border border-slate-700 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <Headphones className="w-5 h-5 text-emerald-400" />
          <span className="hidden sm:inline text-xs font-bold">24/7 Support</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setAuthModalOpen(false);
        }}
      />

      {currentUser && (
        <>
          <InternalTransferModal
            isOpen={internalTransferOpen}
            currentUser={currentUser}
            onClose={() => setInternalTransferOpen(false)}
            onSuccess={handleTransferSuccess}
          />

          <InternationalTransferModal
            isOpen={internationalTransferOpen}
            currentUser={currentUser}
            onClose={() => setInternationalTransferOpen(false)}
            onSuccess={handleTransferSuccess}
          />

          <DepositModal
            isOpen={depositModalOpen}
            currentUser={currentUser}
            onClose={() => setDepositModalOpen(false)}
            onSuccess={() => {}}
          />

          <ProfileModal
            isOpen={profileModalOpen}
            currentUser={currentUser}
            onClose={() => setProfileModalOpen(false)}
            onUpdated={(updated) => setCurrentUser(updated)}
          />

          <LiveSupportChat
            isOpen={liveChatOpen}
            currentUser={currentUser}
            onClose={() => setLiveChatOpen(false)}
          />
        </>
      )}

      <TransactionReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
      />
    </div>
  );
}
