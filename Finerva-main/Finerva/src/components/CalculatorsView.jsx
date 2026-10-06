import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  CreditCard, 
  Users, 
  DollarSign, 
  PieChart,
  ArrowRight
} from 'lucide-react';

export const CalculatorsView = () => {
  const [activeTab, setActiveTab] = useState('sip'); // 'sip' | 'emi' | 'split'

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState(500);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanRate, setLoanRate] = useState(7.5);
  const [loanTenureYears, setLoanTenureYears] = useState(5);

  // Bill Splitter State
  const [billTotal, setBillTotal] = useState(180);
  const [tipPercent, setTipPercent] = useState(15);
  const [numPeople, setNumPeople] = useState(4);

  // SIP Calculation
  const totalMonths = sipYears * 12;
  const monthlyRate = sipRate / 12 / 100;
  const sipInvested = sipMonthly * totalMonths;
  // Future Value of an annuity
  const sipTotalWealth = monthlyRate > 0 
    ? Math.round(sipMonthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
    : sipInvested;
  const sipEstimatedReturns = sipTotalWealth - sipInvested;

  // EMI Calculation
  const emiMonthlyRate = loanRate / 12 / 100;
  const emiMonths = loanTenureYears * 12;
  const emiPerMonth = emiMonthlyRate > 0
    ? Math.round((loanAmount * emiMonthlyRate * Math.pow(1 + emiMonthlyRate, emiMonths)) / (Math.pow(1 + emiMonthlyRate, emiMonths) - 1))
    : Math.round(loanAmount / emiMonths);
  const emiTotalPayment = emiPerMonth * emiMonths;
  const emiTotalInterest = emiTotalPayment - loanAmount;

  // Bill Split Calculation
  const tipAmount = (billTotal * tipPercent) / 100;
  const grandTotal = billTotal + tipAmount;
  const perPerson = numPeople > 0 ? (grandTotal / numPeople).toFixed(2) : '0.00';

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Financial Modeling & Calculators</h1>
          <p className="text-sm text-slate-400 mt-1">Simulate investment compounding, debt amortizations, and expense sharing</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('sip')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'sip' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            SIP Compounding
          </button>
          <button
            onClick={() => setActiveTab('emi')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'emi' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Loan EMI
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'split' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bill Splitter
          </button>
        </div>
      </div>

      {/* SIP Compounding Calculator */}
      {activeTab === 'sip' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>SIP Parameters</span>
            </h2>

            {/* Monthly Investment */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Monthly Deposit ($)</span>
                <span className="text-white font-bold text-sm">${sipMonthly.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="5000" 
                step="50"
                value={sipMonthly} 
                onChange={(e) => setSipMonthly(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Expected Return Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Expected Annual Return (%)</span>
                <span className="text-emerald-400 font-bold text-sm">{sipRate}%</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="25" 
                step="0.5"
                value={sipRate} 
                onChange={(e) => setSipRate(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Time Horizon */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Investment Horizon (Years)</span>
                <span className="text-white font-bold text-sm">{sipYears} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1"
                value={sipYears} 
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-950 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">Total Projected Wealth</span>
              <p className="text-3xl sm:text-4xl font-black text-white mt-2">${sipTotalWealth.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">Based on monthly compounding over {sipYears} years</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">Total Amount Invested</span>
                <p className="text-lg font-bold text-slate-200 mt-1">${sipInvested.toLocaleString()}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs text-emerald-400">Estimated Wealth Gain</span>
                <p className="text-lg font-bold text-emerald-300 mt-1">+${sipEstimatedReturns.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              💡 <strong>Finerva Rule:</strong> Starting 5 years earlier nearly doubles final terminal wealth due to exponential compounding curves.
            </div>
          </div>
        </div>
      )}

      {/* EMI Calculator */}
      {activeTab === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-400" />
              <span>Loan & EMI Setup</span>
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Principal Loan Amount ($)</span>
                <span className="text-white font-bold text-sm">${loanAmount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="200000" 
                step="1000"
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-teal-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Interest Rate (% p.a.)</span>
                <span className="text-teal-400 font-bold text-sm">{loanRate}%</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="20" 
                step="0.25"
                value={loanRate} 
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full accent-teal-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Tenure (Years)</span>
                <span className="text-white font-bold text-sm">{loanTenureYears} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="15" 
                step="1"
                value={loanTenureYears} 
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full accent-teal-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-950/20 via-slate-900/60 to-slate-950 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-teal-400">Monthly Installment (EMI)</span>
              <p className="text-3xl sm:text-4xl font-black text-white mt-2">${emiPerMonth.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ mo</span></p>
              <p className="text-xs text-slate-400 mt-1">Total {emiMonths} monthly payments</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">Principal Amount</span>
                <p className="text-lg font-bold text-slate-200 mt-1">${loanAmount.toLocaleString()}</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs text-rose-400">Total Interest Payable</span>
                <p className="text-lg font-bold text-rose-300 mt-1">${emiTotalInterest.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
              Total repayment liability: <strong className="text-white">${emiTotalPayment.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Bill Splitter */}
      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Bill Breakdown</span>
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Total Bill Amount ($)</label>
              <input 
                type="number" 
                value={billTotal} 
                onChange={(e) => setBillTotal(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold text-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tip Percentage (%)</label>
                <input 
                  type="number" 
                  value={tipPercent} 
                  onChange={(e) => setTipPercent(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Number of People</label>
                <input 
                  type="number" 
                  min="1"
                  value={numPeople} 
                  onChange={(e) => setNumPeople(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-slate-950 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">Each Person Pays</span>
              <p className="text-3xl sm:text-4xl font-black text-white mt-2">${perPerson}</p>
              <p className="text-xs text-slate-400 mt-1">Even split between {numPeople} participants</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">Tip Amount</span>
                <p className="text-lg font-bold text-slate-200 mt-1">${tipAmount.toFixed(2)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-xs text-cyan-400">Grand Total</span>
                <p className="text-lg font-bold text-cyan-300 mt-1">${grandTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
              Fast, zero-rounding fair share calculation ready to copy.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
