import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  ShieldCheck, 
  Laptop, 
  Plane, 
  TrendingUp, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const GoalsView = ({ goals, onUpdateGoals }) => {
  const [goalList, setGoalList] = useState(goals);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Security');

  const getIcon = (cat) => {
    switch(cat) {
      case 'Security': return ShieldCheck;
      case 'Tech': return Laptop;
      case 'Travel': return Plane;
      default: return TrendingUp;
    }
  };

  const handleDeposit = (id, amount) => {
    setGoalList(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, current: Math.min(g.target, g.current + amount) };
      }
      return g;
    }));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!title || !target) return;
    const newGoal = {
      id: 'g-' + Date.now(),
      title,
      target: parseFloat(target),
      current: 0,
      deadline: deadline || '2027',
      category
    };
    setGoalList(prev => [...prev, newGoal]);
    setShowModal(false);
    setTitle('');
    setTarget('');
    setDeadline('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Savings Goals & Wealth Milestones</h1>
          <p className="text-sm text-slate-400 mt-1">Autonomous compounding progress tracked against your financial targets</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Goal</span>
        </button>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goalList.map((g) => {
          const Icon = getIcon(g.category);
          const percent = Math.min(100, Math.round((g.current / g.target) * 100));
          const isComplete = percent >= 100;

          return (
            <div 
              key={g.id}
              className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-800/80 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{g.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                        {g.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Target: {g.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-xl font-black text-emerald-400">{percent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Saved: <strong className="text-white">${g.current.toLocaleString()}</strong></span>
                  <span>Target: <strong className="text-slate-200">${g.target.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Quick Deposit Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                <span className="text-xs text-slate-400 font-medium">Quick Deposit:</span>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={isComplete}
                    onClick={() => handleDeposit(g.id, 100)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-40"
                  >
                    +$100
                  </button>
                  <button 
                    disabled={isComplete}
                    onClick={() => handleDeposit(g.id, 500)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold disabled:opacity-40"
                  >
                    +$500
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create Savings Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Goal Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Home Downpayment / Tech Gear" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Amount ($)</label>
                <input 
                  type="number" 
                  required
                  placeholder="5000" 
                  value={target} 
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Security">Security</option>
                    <option value="Tech">Tech</option>
                    <option value="Travel">Travel</option>
                    <option value="Wealth">Wealth</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Date</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Dec 2026" 
                    value={deadline} 
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
