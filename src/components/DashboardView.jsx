import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Filter
} from 'lucide-react';

export const DashboardView = ({ 
  user, 
  transactions, 
  onAddTransaction, 
  goals, 
  budgets, 
  onOpenAI 
}) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food & Dining');
  const [newType, setNewType] = useState('debit');

  const totalBalance = 24850.40;
  const monthlySpend = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleCreateTx = (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;
    onAddTransaction({
      id: 'tx-' + Date.now(),
      title: newTitle,
      amount: parseFloat(newAmount),
      type: newType,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      merchant: 'Direct Entry',
    });
    setNewTitle('');
    setNewAmount('');
    setShowAddModal(false);
  };

  const filteredTransactions = filterCategory === 'All' 
    ? transactions 
    : transactions.filter(t => t.category === filterCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-emerald-950/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Finerva Real-Time Security Shield Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-xl">
              Your financial net worth is up <strong className="text-emerald-400">+4.2%</strong> this month. Dual-AI recommends directing $450 into index fund reserves before Friday.
            </p>
          </div>

          {/* Health Score Pill */}
          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30">
              <span className="text-xl font-black text-emerald-400">{user.healthScore}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Health Score</p>
              <p className="text-sm font-bold text-white">Optimal Condition</p>
              <p className="text-xs text-emerald-400">Top 12% in peer bracket</p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          <button 
            onClick={onOpenAI}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-xs transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Budget Diagnosis</span>
          </button>
        </div>
      </div>

      {/* 4 Major Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Balance */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Balance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8.4% from last month</span>
            </div>
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Outflow</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">${monthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400 font-medium">
              <ArrowDownRight className="w-4 h-4" />
              <span>36% of monthly income</span>
            </div>
          </div>
        </div>

        {/* Savings Goal Progress */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Savings Velocity</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">$1,800.00 <span className="text-xs text-slate-400 font-normal">/ mo</span></p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-cyan-400 font-medium">
              <span>90% of $2,000 target met</span>
            </div>
          </div>
        </div>

        {/* Investments */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Investments Value</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">$42,180.50</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>+14.2% annualized ROI</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Transactions & Goals Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transactions Feed (2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Recent Activity</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                  {filteredTransactions.length} items
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Automated ledger with client-side verification</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Categories</option>
                <option value="Income">Income</option>
                <option value="Housing">Housing</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Investments">Investments</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
          </div>

          {/* Transaction Rows */}
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 hover:bg-slate-800/50 border border-slate-800/60 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                    {tx.type === 'credit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{tx.title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{tx.merchant}</span>
                      <span>•</span>
                      <span className="text-[11px] px-2 py-0.2 rounded-md bg-slate-800 text-slate-400">{tx.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{tx.date}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals & Budget Overview (1 Column) */}
        <div className="space-y-6">
          
          {/* Active Goals Mini Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 mb-4">
              Priority Goals Progress
            </h3>

            <div className="space-y-4">
              {goals.slice(0, 3).map((g) => {
                const percent = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <div key={g.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[170px]">{g.title}</span>
                      <span className="font-bold text-emerald-400">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>${g.current.toLocaleString()}</span>
                      <span>Target: ${g.target.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Advisor Insight Card */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-900/40 relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Smart Recommendation</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Automate $200 weekly SIP</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your predictable cashflow surplus, investing $200 weekly into low-cost index funds will yield an estimated <strong>$14,200</strong> in compounded returns over 5 years.
            </p>
            <button 
              onClick={onOpenAI}
              className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>Explore scenario with Finerva AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-white mb-4">Add New Transaction</h3>
            <form onSubmit={handleCreateTx} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description / Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Grocery Shopping" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    placeholder="0.00" 
                    value={newAmount} 
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Type</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="debit">Expense (Debit)</option>
                    <option value="credit">Income (Credit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Housing">Housing</option>
                  <option value="Investments">Investments</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
