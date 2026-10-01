import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, ArrowRight, Printer, Download, Share2 } from 'lucide-react';
import { Transaction } from '../lib/types.ts';

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  onClose
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPending = transaction.status === 'pending';
  const isReversed = transaction.status === 'reversed';
  const isCompleted = transaction.status === 'completed';

  const receiverBankName = transaction.recipientBank || 'Veritas Domestic Reserve';
  const receiverPersonName = transaction.recipientName || 'Beneficiary';

  // Format date like in image: "15 Aug, 2026"
  const formattedDate = new Date(transaction.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const chargesFee = transaction.type === 'international' ? 25.00 : 0.00;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container matching screenshot exactly */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white">
          
          {/* Header Row: Box Badge + "Payment" Title | Status Pill + Clock Icon */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              {/* Rounded square box badge with border (MINI SOO / VERI TAS) */}
              <div className="w-12 h-12 rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center font-black text-[9px] uppercase tracking-wider leading-none shadow-2xs select-none">
                <span>VERI</span>
                <span>TAS</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Payment</h2>
            </div>

            {/* Status Pill Badge + Clock/Check Icon */}
            <div className="flex items-center gap-1.5">
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
                isReversed
                  ? 'border-rose-300 text-rose-700 bg-rose-50'
                  : isPending
                  ? 'border-red-300 text-red-800 bg-red-50/50'
                  : 'border-emerald-300 text-emerald-800 bg-emerald-50/60'
              }`}>
                {isReversed ? 'Reversed' : isPending ? 'Pending' : 'Completed'}
              </span>

              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                isReversed
                  ? 'border-rose-700 text-rose-700'
                  : isPending
                  ? 'border-red-800 text-red-800'
                  : 'border-emerald-600 text-emerald-600'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
              </div>
            </div>
          </div>

          {/* Large Bold Amount */}
          <div className="pt-1">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight font-sans">
              ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
          </div>

          {/* Subtitle Description & Bank Routing Diagram */}
          <div className="grid grid-cols-12 gap-4 items-center pt-1">
            {/* Descriptive message on left */}
            <div className="col-span-7">
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {isReversed
                  ? 'Your transaction has been officially reversed by bank management. Funds have been returned to sender.'
                  : isPending
                  ? 'Your payment has been sent successfully and is currently pending. It will be reflected in the recipient\'s account once confirmed by their bank.'
                  : 'Your payment has been sent successfully and cleared. It has been reflected in the recipient\'s account by their bank.'}
              </p>
            </div>

            {/* Bank routing visual diagram on right */}
            <div className="col-span-5 flex items-center justify-center gap-2">
              {/* Your Bank (Blue) */}
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10h20L12 3z" />
                </svg>
                <span className="text-[8px] font-black uppercase text-blue-800 tracking-tight mt-1 leading-none">YOUR BANK</span>
              </div>

              {/* Arrow in circle */}
              <div className="w-5 h-5 rounded-full border border-slate-950 flex items-center justify-center shrink-0">
                <ArrowRight className="w-3 h-3 text-slate-950 stroke-[2.5]" />
              </div>

              {/* Receiver's Bank (Red/Crimson) */}
              <div className="flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10h20L12 3z" />
                </svg>
                <span className="text-[8px] font-black uppercase text-red-800 tracking-tight mt-1 leading-none">RECEIVER'S BANK</span>
              </div>
            </div>
          </div>

          {/* Clean Itemized Data Table with dividers (as seen in screenshot) */}
          <div className="divide-y divide-slate-100 text-xs pt-2">
            {/* Status */}
            <div className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">Status</span>
              <span className={`font-bold ${
                isReversed ? 'text-rose-600' : isPending ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {isReversed ? 'Reversed' : isPending ? 'Pending' : 'Completed'}
              </span>
            </div>

            {/* From */}
            <div className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">From</span>
              <span className="font-bold text-slate-950 text-right">{transaction.senderName}</span>
            </div>

            {/* To */}
            <div className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">To</span>
              <span className="font-bold text-slate-950 text-right truncate max-w-[220px]">
                {receiverBankName}
              </span>
            </div>

            {/* Receiver Name */}
            <div className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">Receiver Name</span>
              <span className="font-bold text-slate-950 text-right">{receiverPersonName}</span>
            </div>

            {/* Amount */}
            <div className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">Amount</span>
              <span className="font-bold text-slate-950 text-right font-mono">
                ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Charges Fee */}
            <div className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">Charges Fee</span>
              <span className="font-bold text-slate-950 text-right font-mono">
                ${chargesFee.toFixed(2)}
              </span>
            </div>

            {/* Reference ID */}
            <div className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">Reference ID</span>
              <span className="font-black text-slate-950 text-right font-mono tracking-tight">
                {transaction.reference || 'PAY250524180001'}
              </span>
            </div>

            {/* Date & Time */}
            <div className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">Date & Time</span>
              <span className="font-bold text-slate-950 text-right">{formattedDate}</span>
            </div>
          </div>

          {/* Bottom Callout Box with (i) Icon */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start gap-2.5 text-xs text-slate-700">
            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center shrink-0 mt-0.5 font-serif text-slate-600 font-bold text-[11px]">
              i
            </div>
            <p className="leading-snug">
              {isReversed
                ? 'This transaction was reversed and adjusted across Veritas settlement ledgers.'
                : 'The money has been sent to the receiver\'s account and is currently pending confirmation from their bank.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
