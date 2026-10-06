import { useEffect, useState } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';

export const BudgetView = ({ budgets, onUpdateBudget, user }) => {
  const [list, setList] = useState(budgets);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newAllocated, setNewAllocated] = useState('');

  const currency = user?.currency || 'USD';
  const money = a => new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(a);
  const income = Number(user?.monthlyIncome || 0);
  const totalAllocated = list.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = list.reduce((s, b) => s + b.spent, 0);

  useEffect(() => setList(budgets), [budgets]);

  const handleAdd = e => {
    e.preventDefault();
    if (!newCategory || !newAllocated) return;
    const next = [...list, { id: 'b-' + Date.now(), category: newCategory, allocated: parseFloat(newAllocated), spent: 0, color: 'emerald' }];
    setList(next); onUpdateBudget(next); setShowModal(false); setNewCategory(''); setNewAllocated('');
  };

  const inputStyle = { width: '100%', padding: '8px 11px', fontSize: 13, color: 'var(--ink)', background: 'var(--surface-2)', border: '1px solid transparent', borderRadius: 8, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 5 };

  const guides = [
    { label: 'Needs (50%)', guide: income * 0.5, color: '#2d5c42', bg: '#e8f0eb' },
    { label: 'Wants (30%)', guide: income * 0.3, color: '#1e3a5f', bg: '#eef2f8' },
    { label: 'Savings (20%)', guide: income * 0.2, color: '#5c3d1a', bg: '#fef3e2' },
  ];

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Budgets</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-3)' }}>Set category limits and track your spending.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} /> New Budget
        </button>
      </div>

      {/* 50/30/20 guide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {guides.map(g => (
          <div key={g.label} style={{ background: 'var(--surface)', borderRadius: 16, padding: '20px', boxShadow: 'var(--card-shadow)' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: g.color }}>{g.label}</p>
            <p style={{ margin: '8px 0 2px', fontSize: 20, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>{money(g.guide)}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-3)' }}>Guideline based on your income</p>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '20px', boxShadow: 'var(--card-shadow)', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div><p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-3)' }}>Total Allocated</p><p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{money(totalAllocated)}</p></div>
        <div><p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-3)' }}>Total Spent</p><p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{money(totalSpent)}</p></div>
        <div><p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-3)' }}>Remaining</p><p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: totalAllocated - totalSpent >= 0 ? 'var(--accent-mid)' : 'var(--red)' }}>{money(totalAllocated - totalSpent)}</p></div>
      </div>

      {/* Budget rows */}
      <div style={{ background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--card-shadow)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Category Allocations</h2>
        </div>
        {list.map((item, i) => {
          const pct = Math.min(100, Math.round((item.spent / item.allocated) * 100));
          const over = item.spent > item.allocated;
          const near = pct >= 85 && !over;
          const barColor = over ? 'var(--red)' : near ? 'var(--amber)' : 'var(--accent-mid)';
          return (
            <div key={item.id} style={{ padding: '16px 20px', borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{item.category}</span>
                  {over && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', background: 'var(--red-light)', color: 'var(--red)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={10} /> Over budget</span>}
                  {near && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', background: 'var(--amber-light)', color: 'var(--amber)', borderRadius: 4 }}>Near limit</span>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>{pct}%</span>
              </div>
              <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 9999, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 9999, transition: 'width 0.4s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Spent: <strong style={{ color: 'var(--ink)' }}>{money(item.spent)}</strong></span>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Limit: <strong style={{ color: 'var(--ink)' }}>{money(item.allocated)}</strong></span>
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p style={{ padding: '24px 20px', fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>No budgets yet. Create one to start tracking.</p>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 10, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Add Budget Category</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label><span style={labelStyle}>Category name</span><input type="text" required placeholder="e.g. Tech & Software" value={newCategory} onChange={e => setNewCategory(e.target.value)} style={inputStyle} /></label>
              <label><span style={labelStyle}>Monthly limit ({currency})</span><input type="number" required placeholder="500" value={newAllocated} onChange={e => setNewAllocated(e.target.value)} style={inputStyle} /></label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', background: 'none', border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
