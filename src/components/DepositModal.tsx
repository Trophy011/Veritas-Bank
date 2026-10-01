import React, { useState } from 'react';
import { X, ArrowDownToLine, Camera, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { UserProfile } from '../lib/types.ts';
import { bankService } from '../lib/bank-service.ts';

interface DepositModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSuccess
}) => {
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('Mobile Check Deposit');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid deposit amount.');
      return;
    }

    setLoading(true);

    try {
      const res = await bankService.depositFunds(currentUser.uid, accountType, parsed, memo);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Failed to process deposit.');
      }
    } catch (e: any) {
      setError(e.message || 'Deposit failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-xs">
        
        <div className="bg-slate-900 text-white p-6 pb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold tracking-tight">Mobile Check Deposit</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-300 mt-1">
            Funds cleared with zero holding fees into your Veritas insured account.
          </p>
        </div>

        <form onSubmit={handleDeposit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">Deposit Destination</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAccountType('checking')}
                className={`p-3 rounded-xl border text-left cursor-pointer ${
                  accountType === 'checking'
                    ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                    : 'border-slate-200'
                }`}
              >
                <p className="font-bold text-slate-900">Everyday Checking</p>
                <p className="text-[11px] text-slate-500 font-mono">...{currentUser.checkingAccountNumber}</p>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('savings')}
                className={`p-3 rounded-xl border text-left cursor-pointer ${
                  accountType === 'savings'
                    ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                    : 'border-slate-200'
                }`}
              >
                <p className="font-bold text-slate-900">Way2Save® Savings</p>
                <p className="text-[11px] text-slate-500 font-mono">...{currentUser.savingsAccountNumber}</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Check Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500.00"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Check Camera Capture Mockup */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Check Verification Scan</label>
            <div 
              onClick={() => setHasPhoto(true)}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50"
            >
              {hasPhoto ? (
                <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Check Front & Back Endorsement Verified</span>
                </div>
              ) : (
                <div className="space-y-1 text-slate-500">
                  <Camera className="w-6 h-6 mx-auto text-slate-400" />
                  <p className="font-semibold text-slate-700">Click to capture check image</p>
                  <p className="text-[10px] text-slate-400">Ensure check is endorsed with "For Veritas Mobile Deposit Only"</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Check Memo / Issuer</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="e.g. Dividend payment, Tech paycheck"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing Clear...' : 'Clear Check Deposit'}
          </button>
        </form>

      </div>
    </div>
  );
};
