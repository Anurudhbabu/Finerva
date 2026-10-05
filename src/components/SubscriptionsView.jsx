import React, { useEffect, useState } from 'react';
import { 
  Repeat, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  ShieldAlert 
} from 'lucide-react';

export const SubscriptionsView = ({ subscriptions, onUpdateSubscriptions, user }) => {
  const [subList, setSubList] = useState(subscriptions);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('Developer Tools');

  const monthlyTotal = subList.reduce((acc, s) => acc + s.cost, 0);
  const annualTotal = monthlyTotal * 12;
  const potentialAnnualSavings = subList.filter((subscription) => subscription.status.includes('Flagged')).reduce((total, subscription) => total + subscription.cost * 12, 0);
  const money = (amount) => new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: user?.currency || 'USD',
    maximumFractionDigits: 2
  }).format(amount);

  useEffect(() => setSubList(subscriptions), [subscriptions]);

  const handleRemove = (id) => {
    const nextSubscriptions = subList.filter(s => s.id !== id);
    setSubList(nextSubscriptions);
    onUpdateSubscriptions(nextSubscriptions);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !cost) return;
    const newSub = {
      id: 'sub-' + Date.now(),
      name,
      cost: parseFloat(cost),
      billingCycle: 'monthly',
      nextBilling: '2026-11-01',
      category,
      status: 'Active'
    };
    const nextSubscriptions = [...subList, newSub];
    setSubList(nextSubscriptions);
    onUpdateSubscriptions(nextSubscriptions);
    setShowModal(false);
    setName('');
    setCost('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Subscriptions & Recurring Bills</h1>
          <p className="text-sm text-slate-400 mt-1">Autonomous audit of recurring software, memberships, and streaming leaks</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Burn</span>
          <p className="text-2xl font-black text-white mt-1">{money(monthlyTotal)}</p>
          <p className="text-xs text-slate-400 mt-1">{subList.length} active service commitments</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Annual Run-Rate</span>
          <p className="text-2xl font-black text-rose-400 mt-1">{money(annualTotal)}</p>
          <p className="text-xs text-slate-400 mt-1">Projected 12-month drain on savings</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Potential Savings</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{money(potentialAnnualSavings)} <span className="text-xs font-normal text-slate-300">/ yr</span></p>
          <p className="text-xs text-slate-400 mt-1">Estimated from subscriptions you flag for review</p>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <h2 className="text-base font-bold text-white">Active Subscriptions</h2>
          <span className="text-xs text-slate-400 font-medium">Sorted by next billing date</span>
        </div>

        <div className="space-y-3">
          {subList.map((sub) => {
            const isFlagged = sub.status.includes('Flagged');
            return (
              <div 
                key={sub.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                  isFlagged 
                    ? 'bg-rose-950/20 border-rose-500/30' 
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isFlagged ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{sub.name}</h3>
                      {isFlagged && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Flagged: Zero Usage in 30 Days
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{sub.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next renewal: {sub.nextBilling}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-white">{money(sub.cost)}</p>
                    <p className="text-[11px] text-slate-400 capitalize">{sub.billingCycle}</p>
                  </div>

                  <button 
                    onClick={() => handleRemove(sub.id)}
                    title="Remove / Cancel Subscription"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {subList.length === 0 && <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">No subscriptions recorded. Add recurring services to track their costs.</p>}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Subscription</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Service Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Netflix / Claude Pro" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Cost ({user?.currency || 'USD'})</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="19.99" 
                  value={cost} 
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Developer Tools">Developer Tools</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Productivity">Productivity</option>
                </select>
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
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
