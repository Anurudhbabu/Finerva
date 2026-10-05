import React, { useState } from 'react';
import { 
  PieChart, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const BudgetView = ({ budgets, onUpdateBudget }) => {
  const [budgetList, setBudgetList] = useState(budgets);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newAllocated, setNewAllocated] = useState('');

  const totalAllocated = budgetList.reduce((acc, b) => acc + b.allocated, 0);
  const totalSpent = budgetList.reduce((acc, b) => acc + b.spent, 0);
  const remaining = totalAllocated - totalSpent;

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!newCategory || !newAllocated) return;
    const item = {
      id: 'b-' + Date.now(),
      category: newCategory,
      allocated: parseFloat(newAllocated),
      spent: 0,
      color: 'emerald'
    };
    setBudgetList(prev => [...prev, item]);
    setShowModal(false);
    setNewCategory('');
    setNewAllocated('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Smart Budgets & Spend Tracker</h1>
          <p className="text-sm text-slate-400 mt-1">Autonomous monitoring aligned with the 50/30/20 wealth framework</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Category Budget</span>
        </button>
      </div>

      {/* 50/30/20 Rule Visual Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Needs (50%)</span>
            <span className="text-xs text-slate-400">Target: $3,250</span>
          </div>
          <p className="text-xl font-black text-white mt-2">$2,195.40</p>
          <p className="text-xs text-slate-400 mt-1">Rent, Utilities, Food & Core Commute</p>
          <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '67%' }} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Wants (30%)</span>
            <span className="text-xs text-slate-400">Target: $1,950</span>
          </div>
          <p className="text-xl font-black text-white mt-2">$825.00</p>
          <p className="text-xs text-slate-400 mt-1">Dining Out, Gadgets & Leisure</p>
          <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: '42%' }} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Savings & Growth (20%)</span>
            <span className="text-xs text-slate-400">Target: $1,300</span>
          </div>
          <p className="text-xl font-black text-white mt-2">$1,800.00</p>
          <p className="text-xs text-emerald-400 font-semibold mt-1">Exceeding baseline by +38%!</p>
          <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Monthly Category Allocations</h2>
            <p className="text-xs text-slate-400">Remaining unallocated cushion: <strong className="text-emerald-400">${remaining.toLocaleString()}</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetList.map((item) => {
            const pct = Math.min(100, Math.round((item.spent / item.allocated) * 100));
            const isNearLimit = pct >= 85;
            const isOverLimit = item.spent > item.allocated;

            return (
              <div 
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.category}</span>
                    {isOverLimit && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Over Budget
                      </span>
                    )}
                    {isNearLimit && !isOverLimit && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1">
                        Near Cap
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-300">{pct}%</span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverLimit 
                        ? 'bg-rose-500' 
                        : isNearLimit 
                          ? 'bg-amber-400' 
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Spent: <strong className="text-white">${item.spent.toLocaleString()}</strong></span>
                  <span>Limit: <strong className="text-slate-200">${item.allocated.toLocaleString()}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Budget Category</h3>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Tech & Software" 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Limit ($)</label>
                <input 
                  type="number" 
                  required
                  placeholder="500" 
                  value={newAllocated} 
                  onChange={(e) => setNewAllocated(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Create Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
