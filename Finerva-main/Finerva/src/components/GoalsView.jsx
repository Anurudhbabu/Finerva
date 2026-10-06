import { useEffect, useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';

export const GoalsView = ({ goals, onUpdateGoals, user }) => {
  const [list, setList] = useState(goals);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Security');

  useEffect(() => setList(goals), [goals]);
  const money = a => new Intl.NumberFormat(undefined, { style: 'currency', currency: user?.currency || 'USD', maximumFractionDigits: 0 }).format(a);

  const deposit = (id, amount) => {
    const next = list.map(g => g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g);
    setList(next); onUpdateGoals(next);
  };

  const handleAdd = e => {
    e.preventDefault();
    if (!title || !target) return;
    const next = [...list, { id: 'g-' + Date.now(), title, target: parseFloat(target), current: 0, deadline: deadline || '2027', category }];
    setList(next); onUpdateGoals(next); setShowModal(false); setTitle(''); setTarget(''); setDeadline('');
  };

  const inputStyle = { width: '100%', padding: '8px 11px', fontSize: 13, color: 'var(--ink)', background: 'var(--surface-2)', border: '1px solid transparent', borderRadius: 8, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 5 };

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Savings Goals</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-3)' }}>Track progress toward your financial milestones.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} /> Add Goal
        </button>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--card-shadow)' }}>
        {list.map((g, i) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          const done = pct >= 100;
          return (
            <div key={g.id} style={{ padding: '20px', borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{g.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--ink-2)', fontWeight: 500 }}>{g.category}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} />{g.deadline}</span>
                  </div>
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: done ? 'var(--accent-mid)' : 'var(--ink)', letterSpacing: '-0.04em', flexShrink: 0 }}>{pct}%</span>
              </div>

              <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 9999, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: done ? 'var(--accent-mid)' : 'var(--accent)', borderRadius: 9999, transition: 'width 0.4s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Saved: <strong style={{ color: 'var(--ink)' }}>{money(g.current)}</strong></span>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Target: <strong style={{ color: 'var(--ink)' }}>{money(g.target)}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>Quick deposit:</span>
                {[100, 500].map(amt => (
                  <button key={amt} disabled={done} onClick={() => deposit(g.id, amt)} style={{
                    padding: '5px 12px', fontSize: 12, fontWeight: 600, border: '1px solid var(--border)',
                    borderRadius: 5, background: 'var(--surface-2)', color: 'var(--ink-2)', cursor: done ? 'not-allowed' : 'pointer',
                    opacity: done ? 0.4 : 1, fontFamily: 'inherit'
                  }}>+{money(amt)}</button>
                ))}
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p style={{ padding: '24px 20px', fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>No goals yet. Add one to start tracking.</p>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 10, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Create Savings Goal</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label><span style={labelStyle}>Goal name</span><input type="text" required placeholder="e.g. Home Downpayment" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} /></label>
              <label><span style={labelStyle}>Target amount ({user?.currency || 'USD'})</span><input type="number" required placeholder="5000" value={target} onChange={e => setTarget(e.target.value)} style={inputStyle} /></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label><span style={labelStyle}>Category</span>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                    {['Security', 'Tech', 'Travel', 'Wealth'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label><span style={labelStyle}>Target date</span><input type="text" placeholder="Dec 2026" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} /></label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', background: 'none', border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
