import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Globe2, 
  Zap, 
  Lock, 
  CreditCard, 
  TrendingUp, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  FileCheck,
  ChevronRight,
  Headphones,
  DollarSign
} from 'lucide-react';
import { INTERNATIONAL_COUNTRIES_AND_BANKS } from '../lib/constants.ts';

interface LandingPageProps {
  onOpenAuth: (mode?: 'signin' | 'register') => void;
  onOpenChat: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onOpenChat }) => {
  const [calcAmountUSD, setCalcAmountUSD] = useState<number>(2500);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('GB');

  const selectedCountry = INTERNATIONAL_COUNTRIES_AND_BANKS.find(c => c.countryCode === selectedCountryCode) || INTERNATIONAL_COUNTRIES_AND_BANKS[0];
  const convertedAmount = (calcAmountUSD * selectedCountry.exchangeRateToUSD).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-radial from-slate-100 via-white to-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>FDIC Insured • Member FDIC • Institutional Grade</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                Sovereign Banking, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900">
                  Engineered for Absolute Trust.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Experience high-velocity internal bank transfers, worldwide SWIFT & IBAN international wires, 5.15% APY high-yield savings, and military-grade encryption with Veritas Online Banking.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-8 py-4 rounded-xl text-base font-bold text-white bg-slate-950 hover:bg-slate-800 shadow-xl shadow-slate-950/20 hover:shadow-slate-950/30 transition-all flex items-center justify-center gap-3 group cursor-pointer"
                >
                  <span>Open An Account</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-7 py-4 rounded-xl text-base font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Access Online Banking</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">5.15% <span className="text-xs font-semibold text-emerald-600">APY</span></p>
                  <p className="text-xs font-medium text-slate-500">Way2Save® High-Yield</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">$0.00</p>
                  <p className="text-xs font-medium text-slate-500">Zero Min. Deposit to Open</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">30+ <span className="text-xs font-semibold text-slate-500">Countries</span></p>
                  <p className="text-xs font-medium text-slate-500">Instant SWIFT Direct Wire</p>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity App Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-[36px] bg-slate-900 p-3 shadow-2xl shadow-slate-900/30 ring-1 ring-slate-800/80">
                {/* Phone screen inner */}
                <div className="rounded-[28px] bg-gradient-to-b from-purple-100/60 via-slate-50 to-amber-50/40 p-4 overflow-hidden border border-slate-200">
                  {/* Phone Header */}
                  <div className="flex items-center justify-between pb-3 text-slate-800">
                    <span className="text-xs font-bold tracking-tight text-slate-600">VERITAS APP</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[11px] font-semibold text-slate-500">Sign off</span>
                    </div>
                  </div>

                  {/* Greeting */}
                  <div className="mb-3">
                    <p className="text-base text-slate-700">Good evening,</p>
                    <p className="text-2xl font-extrabold text-slate-900 tracking-tight">Ramyia</p>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
                      Veritas Rewards® $27.70 cash rewards <ChevronRight className="w-3.5 h-3.5" />
                    </p>
                  </div>

                  {/* Account Cards */}
                  <div className="space-y-2.5">
                    {/* Checking Card */}
                    <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">EVERYDAY CHECKING ...2246</p>
                      <p className="text-2xl font-extrabold text-slate-900 mt-1">$22,081.16</p>
                      <p className="text-[11px] text-slate-500 font-medium">Available balance</p>
                    </div>

                    {/* Savings Card */}
                    <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">WAY2SAVE® SAVINGS ...9019</p>
                      <p className="text-2xl font-extrabold text-slate-900 mt-1">$150,103.25</p>
                      <p className="text-[11px] text-slate-500 font-medium">Available balance</p>
                    </div>

                    {/* Platinum Card */}
                    <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">PLATINUM CARD ...0739</p>
                      <p className="text-2xl font-extrabold text-slate-900 mt-1">$92.13</p>
                      <p className="text-[11px] text-slate-500 font-medium">Outstanding balance</p>
                    </div>
                  </div>

                  {/* Open Account Pill */}
                  <div className="mt-3 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-slate-400 bg-white/80 text-xs font-bold text-slate-800 shadow-2xs">
                      Open a new account
                    </div>
                  </div>

                  {/* Credit score small widget */}
                  <div className="mt-2.5 bg-white rounded-xl p-2.5 shadow-xs border border-slate-100 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-black">
                      780
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-tight">
                      Monitor your FICO® Score with Credit Close-Up℠
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Global Wire & Currency Converter Section */}
      <section id="calculator" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Worldwide SWIFT Network</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Calculate Your International Transfer in Seconds
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Transfer funds internationally with transparent interbank rates and zero hidden conversion markups.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-950/20 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Inputs */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    You Send (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min="10"
                      max="1000000"
                      value={calcAmountUSD}
                      onChange={(e) => setCalcAmountUSD(Number(e.target.value) || 0)}
                      className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Recipient Destination Country
                  </label>
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                  >
                    {INTERNATIONAL_COUNTRIES_AND_BANKS.map(c => (
                      <option key={c.countryCode} value={c.countryCode}>
                        {c.countryName} ({c.currency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    Supported Banks in {selectedCountry.countryName}:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCountry.banks.slice(0, 4).map(b => (
                      <span key={b.code} className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {b.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conversion Result Card */}
              <div className="md:col-span-5 bg-gradient-to-br from-emerald-950/70 via-slate-800 to-slate-900 p-6 rounded-2xl border border-emerald-500/30 space-y-4">
                <div className="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                  <span>Guaranteed Rate</span>
                  <span>1 USD = {selectedCountry.exchangeRateToUSD} {selectedCountry.currency}</span>
                </div>

                <div>
                  <p className="text-xs text-slate-300 font-medium">Recipient Receives Approximately:</p>
                  <p className="text-3xl sm:text-4xl font-black text-white mt-1">
                    {selectedCountry.currencySymbol} {Number(convertedAmount).toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                    {selectedCountry.currency} Direct Account Credit
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-700 pt-3">
                  <div className="flex justify-between">
                    <span>Wire Processing Fee</span>
                    <span className="text-emerald-400 font-bold">$0.00 (Veritas Zero-Fee)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Arrival</span>
                    <span className="font-semibold text-white">Within minutes (SWIFT GPI)</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Start Transfer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Core Banking Features Grid */}
      <section id="accounts" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Complete Digital Banking Architecture
            </h2>
            <p className="text-slate-600 text-base">
              Every feature designed for modern speed, regulatory rigor, and seamless user control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Instant Internal Transfers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Send and receive money across Veritas bank account holders within milliseconds. Funds reflect immediately on checking and savings balances.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Transfer by Account Number or Email</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Protected by 4-digit Transaction PIN</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Immediate balance synchronization</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Global International Transfers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Wire capital to 30+ countries worldwide. Select your destination country, choose from registered commercial banks, and dispatch SWIFT/IBAN wires.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>SWIFT/BIC and IBAN standard formatting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Multi-currency conversion at spot rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Downloadable official transaction receipts</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Total Customer Data Defense</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your financial identity and sensitive transaction records are fortified with end-to-end 256-bit AES encryption and granular role security.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Zero-Trust security architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Automated suspicious activity detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Granular lock & transfer safety gates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 Live Concierge & Support Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-400 text-xs font-bold uppercase">
                <Headphones className="w-3.5 h-3.5" />
                <span>24/7 Concierge Banker Support</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Live Support with Secure Document & Photo Clearing
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect with Veritas banking officers at any moment. Exchange transaction proofs, official documents, and identity photos directly through our high-speed encrypted chat portal.
              </p>
            </div>
            <div>
              <button
                onClick={onOpenChat}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Launch Live Chat Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-14 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-wider">VERITAS ONLINE BANKING</span>
                <p className="text-[11px] text-slate-500">Chartered Federal Member Institution</p>
              </div>
            </div>
            <div className="flex gap-6 font-medium text-slate-400">
              <a href="#accounts" className="hover:text-white transition-colors">Everyday Checking</a>
              <a href="#accounts" className="hover:text-white transition-colors">Way2Save® Savings</a>
              <a href="#accounts" className="hover:text-white transition-colors">Platinum Card</a>
              <a href="#calculator" className="hover:text-white transition-colors">SWIFT Clearing</a>
              <button onClick={onOpenChat} className="hover:text-white transition-colors cursor-pointer">Live Support</button>
            </div>
          </div>

          <div className="space-y-3 leading-relaxed text-slate-500">
            <p>
              Veritas Online Banking is a licensed financial depository institution. Deposit products offered by Veritas Online Banking, Member FDIC. 
              Checking and savings deposits are insured up to $250,000 per depositor, for each account ownership category.
            </p>
            <p>
              Investment and Wealth management services are subject to market risks, including possible loss of principal. 
              All international wire transfers are subject to regulatory clearance under OFAC, FinCEN, and international AML compliance frameworks.
            </p>
            <p className="text-slate-600 pt-2">
              © {new Date().getFullYear()} Veritas National Bank & Trust Company. All Rights Reserved. Equal Housing Lender.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
