import React, { useState } from 'react';
import { X, ArrowRight, UserCheck, KeyRound, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { UserProfile, Transaction } from '../lib/types.ts';
import { bankService } from '../lib/bank-service.ts';

interface InternalTransferModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSuccess: (tx: Transaction) => void;
}

export const InternalTransferModal: React.FC<InternalTransferModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSuccess
}) => {
  const [sourceAccount, setSourceAccount] = useState<'checking' | 'savings'>('checking');
  const [recipientQuery, setRecipientQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const availableBalance = sourceAccount === 'checking' ? currentUser.checkingBalance : currentUser.savingsBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    if (transferAmount > availableBalance) {
      setError(`Insufficient balance. You have $${availableBalance.toFixed(2)} USD available.`);
      return;
    }

    if (!pin || pin.length !== 4) {
      setError('Please enter your 4-digit transaction PIN.');
      return;
    }

    setLoading(true);

    try {
      const res = await bankService.executeInternalTransfer({
        senderUid: currentUser.uid,
        sourceAccount,
        recipientQuery,
        amount: transferAmount,
        memo,
        pin
      });

      if (res.success && res.transaction) {
        onSuccess(res.transaction);
        onClose();
      } else {
        setError(res.error || 'Failed to complete internal transfer.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during transfer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Veritas Direct Pay</span>
              <h3 className="text-xl font-bold tracking-tight">Internal Bank Transfer</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Send money directly to any Veritas Online Banking account holder with instant clearance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {currentUser.isTransferRestricted && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Transfer Capability Restricted</p>
                <p className="text-[11px] text-amber-800">Bank Management has restricted outgoing transfers on this account.</p>
              </div>
            </div>
          )}

          {/* Select Source Account */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Source Account
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSourceAccount('checking')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  sourceAccount === 'checking'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-slate-900">Everyday Checking</p>
                <p className="text-[11px] text-slate-500 font-mono">...{currentUser.checkingAccountNumber}</p>
                <p className="text-xs font-black text-slate-900 mt-1">${currentUser.checkingBalance.toFixed(2)}</p>
              </button>

              <button
                type="button"
                onClick={() => setSourceAccount('savings')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  sourceAccount === 'savings'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-slate-900">Way2Save® Savings</p>
                <p className="text-[11px] text-slate-500 font-mono">...{currentUser.savingsAccountNumber}</p>
                <p className="text-xs font-black text-slate-900 mt-1">${currentUser.savingsBalance.toFixed(2)}</p>
              </button>
            </div>
          </div>

          {/* Recipient Input */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Recipient Account Number or Email
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={recipientQuery}
                onChange={(e) => setRecipientQuery(e.target.value)}
                placeholder="e.g. 5512 or marcus.vance@techcorp.io"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports 4-digit Veritas account numbers or registered emails.
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Transfer Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Memo */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Memo / Reference
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="e.g. Consulting payment, rent split"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 4-digit PIN */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              4-Digit Security PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-base tracking-widest text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Default PIN is 1234 or configured during account opening.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || currentUser.isLocked || currentUser.isTransferRestricted}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Executing Transfer...' : 'Send Funds Instantly'}
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>

      </div>
    </div>
  );
};
