import React, { useState } from 'react';
import { X, Globe2, Building2, KeyRound, AlertCircle, ArrowRight, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { UserProfile, Transaction } from '../lib/types.ts';
import { INTERNATIONAL_COUNTRIES_AND_BANKS } from '../lib/constants.ts';
import { bankService } from '../lib/bank-service.ts';

interface InternationalTransferModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSuccess: (tx: Transaction) => void;
}

export const InternationalTransferModal: React.FC<InternationalTransferModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSuccess
}) => {
  const [sourceAccount, setSourceAccount] = useState<'checking' | 'savings'>('checking');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('GB');
  const [selectedBankCode, setSelectedBankCode] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientIban, setRecipientIban] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [memo, setMemo] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [countryFilter, setCountryFilter] = useState('');
  const [customBankName, setCustomBankName] = useState('');

  if (!isOpen) return null;

  const filteredCountries = INTERNATIONAL_COUNTRIES_AND_BANKS.filter(c =>
    c.countryName.toLowerCase().includes(countryFilter.toLowerCase()) ||
    c.currency.toLowerCase().includes(countryFilter.toLowerCase()) ||
    c.countryCode.toLowerCase().includes(countryFilter.toLowerCase())
  );

  const currentCountry = INTERNATIONAL_COUNTRIES_AND_BANKS.find(c => c.countryCode === selectedCountryCode) || INTERNATIONAL_COUNTRIES_AND_BANKS[0];
  const availableBanks = currentCountry.banks;

  // Auto-fill swift code when bank selected
  const handleBankChange = (code: string) => {
    setSelectedBankCode(code);
    if (code === 'OTHER') {
      setSwiftCode('');
      return;
    }
    const b = availableBanks.find(bk => bk.code === code);
    if (b) {
      setSwiftCode(b.swiftCode);
    }
  };

  const parsedAmount = parseFloat(amountUSD) || 0;
  const convertedAmount = parsedAmount * currentCountry.exchangeRateToUSD;
  const availableBalance = sourceAccount === 'checking' ? currentUser.checkingBalance : currentUser.savingsBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (parsedAmount <= 0) {
      setError('Please specify a valid transfer amount in USD.');
      return;
    }

    if (parsedAmount > availableBalance) {
      setError(`Insufficient balance. You have $${availableBalance.toFixed(2)} USD available.`);
      return;
    }

    if (!selectedBankCode) {
      setError('Please select a recipient institution in the destination country.');
      return;
    }

    if (!recipientIban) {
      setError('Please provide the recipient IBAN or international account number.');
      return;
    }

    if (!pin || pin.length !== 4) {
      setError('Please enter your 4-digit transaction PIN to authorize international wire.');
      return;
    }

    setLoading(true);

    try {
      const selectedBank = availableBanks.find(b => b.code === selectedBankCode);
      const bankDisplayName = selectedBankCode === 'OTHER' ? (customBankName || 'Commercial Bank') : (selectedBank?.name || 'Commercial Bank');
      const res = await bankService.executeInternationalTransfer({
        senderUid: currentUser.uid,
        sourceAccount,
        recipientName,
        recipientCountry: currentCountry.countryName,
        recipientBank: bankDisplayName,
        recipientIban,
        recipientSwift: swiftCode || selectedBank?.swiftCode || 'SWIFTXX',
        amountUSD: parsedAmount,
        convertedAmount: parseFloat(convertedAmount.toFixed(2)),
        targetCurrency: currentCountry.currency,
        exchangeRate: currentCountry.exchangeRateToUSD,
        memo: memo || 'International SWIFT Wire',
        pin
      });

      if (res.success && res.transaction) {
        onSuccess(res.transaction);
        onClose();
      } else {
        setError(res.error || 'International wire transmission failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Error executing SWIFT wire.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-6 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">SWIFT & IBAN Global Wire</span>
                <h3 className="text-xl font-bold tracking-tight">International Capital Transfer</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Dispatch cross-border wires directly to verified foreign banking institutions in 30+ sovereign nations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {currentUser.isTransferRestricted && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
              Transfer Restriction: International wires are currently disabled on your account by Veritas management.
            </div>
          )}

          {/* Source Account */}
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
                <p className="text-xs font-black text-slate-900 mt-0.5">${currentUser.checkingBalance.toFixed(2)}</p>
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
                <p className="text-xs font-black text-slate-900 mt-0.5">${currentUser.savingsBalance.toFixed(2)}</p>
              </button>
            </div>
          </div>

          {/* Country Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700 uppercase tracking-wide">
                Destination Country ({INTERNATIONAL_COUNTRIES_AND_BANKS.length} Global Nations)
              </label>
              {countryFilter && (
                <button
                  type="button"
                  onClick={() => setCountryFilter('')}
                  className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  placeholder="Filter country (e.g. UK, France, Japan)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>
              <div className="sm:col-span-7">
                <select
                  value={selectedCountryCode}
                  onChange={(e) => {
                    setSelectedCountryCode(e.target.value);
                    setSelectedBankCode('');
                    setCustomBankName('');
                    setSwiftCode('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {filteredCountries.map(c => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {c.countryName} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bank in Country */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                Commercial Bank in {currentCountry.countryName}
              </label>
              <select
                required
                value={selectedBankCode}
                onChange={(e) => handleBankChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Choose Foreign Bank in {currentCountry.countryName} --</option>
                {availableBanks.map(b => (
                  <option key={b.code} value={b.code}>
                    {b.name} (SWIFT: {b.swiftCode})
                  </option>
                ))}
                <option value="OTHER">+ Other Registered Commercial Bank in {currentCountry.countryName}</option>
              </select>
            </div>

            {selectedBankCode === 'OTHER' && (
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Enter Custom Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={customBankName}
                  onChange={(e) => setCustomBankName(e.target.value)}
                  placeholder={`Name of bank in ${currentCountry.countryName}`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Beneficiary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                Beneficiary Full Legal Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Jean-Luc Dupont"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                SWIFT / BIC Code
              </label>
              <input
                type="text"
                required
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                placeholder="BARCGB22"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
              International IBAN / Account Number
            </label>
            <input
              type="text"
              required
              value={recipientIban}
              onChange={(e) => setRecipientIban(e.target.value)}
              placeholder="e.g. GB29BARC20201531234567"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Amount & Real-Time Conversion Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                You Send (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value)}
                  placeholder="1000.00"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
              <span className="text-slate-500">Live Interbank Conversion:</span>
              <span className="font-bold text-slate-900">
                {currentCountry.currencySymbol} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currentCountry.currency}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Exchange Rate: 1 USD = {currentCountry.exchangeRateToUSD} {currentCountry.currency}. Zero routing markup.
            </p>
          </div>

          {/* Memo & PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                Remittance Purpose / Memo
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="e.g. Commercial invoice, family support"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                4-Digit Security PIN
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-bold tracking-widest text-center text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Protected by FinCEN & OFAC global regulatory validation.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || currentUser.isLocked || currentUser.isTransferRestricted}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Dispatching SWIFT Wire...' : 'Authorize International Wire'}
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>

      </div>
    </div>
  );
};
