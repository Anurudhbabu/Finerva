import { useEffect, useState } from 'react';
import { AlertCircle, Calendar, Plus, Trash2, X } from 'lucide-react';

export const SubscriptionsView = ({ subscriptions, onUpdateSubscriptions, user }) => {
  const [list, setList] = useState(subscriptions);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('Developer Tools');

  const money = a => new Intl.NumberFormat(undefined, { style: 'currency', currency: user?.currency || 'USD', maximumFractionDigits: 2 }).format(a);
  const monthly = list.reduce((s, x) => s + x.cost, 0);
  const annual = monthly * 12;
  const savings = list.filter(x => x.status.includes('Flagged')).reduce((s, x) => s + x.cost * 12, 0);

  useEffect(() => setList(subscriptions), [subscriptions]);

  const remove = id => { const next = list.filter(x => x.id !== id); setList(next); onUpdateSubscriptions(next); };

  const handleAdd = e => {
    e.preventDefault();
    if (!name || !cost) return;
    const next = [...list, { id: 'sub-' + Date.now(), name, cost: parseFloat(cost), billingCycle: 'monthly', nextBilling: '2026-11-01', category, status: 'Active' }];
    setList(next); onUpdateSubscriptions(next); setShowModal(false); setName(''); setCost('');
  };

  const inputStyle = { width: '100%', padding: '8px 11px', fontSize: 13, color: 'var(--ink)', background: 'var(--surface-2)', border: '1px solid transparent', borderRadius: 8, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 5 };

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Subscriptions</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-3)' }}>Track recurring services and identify savings opportunities.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} /> Add Subscription
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Monthly Burn', value: money(monthly), sub: `${list.length} services`, color: '#1e3a5f', bg: '#eef2f8' },
          { label: 'Annual Run-Rate', value: money(annual), sub: 'Projected 12-month cost', color: 'var(--red)', bg: 'var(--red-light)' },
          { label: 'Potential Savings', value: money(savings) + '/yr', sub: 'From flagged subscriptions', color: 'var(--accent-mid)', bg: 'var(--accent-light)' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--surface)', borderRadius: 16, padding: '20px', boxShadow: 'var(--card-shadow)' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{k.label}</p>
            <p style={{ margin: '8px 0 2px', fontSize: 20, fontWeight: 700, letterSpacing: '-0.04em', color: k.color }}>{k.value}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-3)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--card-shadow)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Active Subscriptions</h2>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Sorted by next billing</span>
        </div>
        {list.map((sub, i) => {
          const flagged = sub.status.includes('Flagged');
          return (
            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none', background: flagged ? 'var(--red-light)' : 'transparent', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, background: flagged ? '#fde8e4' : 'var(--surface-2)', display: 'grid', placeItems: 'center', color: flagged ? 'var(--red)' : 'var(--ink-3)', flexShrink: 0, border: '1px solid var(--border)' }}>
                  {flagged ? <AlertCircle size={15} /> : <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>{sub.name[0]}</span>}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{sub.name}</span>
                    {flagged && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', background: 'var(--red-light)', color: 'var(--red)', borderRadius: 4, border: '1px solid #f0b0a8' }}>Flagged</span>}
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {sub.category} · <Calendar size={10} /> {sub.nextBilling}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{money(sub.cost)}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)', textTransform: 'capitalize' }}>{sub.billingCycle}</p>
                </div>
                <button onClick={() => remove(sub.id)} title="Remove" style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, border: '1px solid var(--border)', borderRadius: 5, background: 'none', cursor: 'pointer', color: 'var(--ink-3)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = '#f0b0a8'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p style={{ padding: '24px 20px', fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>No subscriptions recorded. Add one to track costs.</p>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 10, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Add Subscription</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label><span style={labelStyle}>Service name</span><input type="text" required placeholder="e.g. Netflix" value={name} onChange={e => setName(e.target.value)} style={inputStyle} /></label>
              <label><span style={labelStyle}>Monthly cost ({user?.currency || 'USD'})</span><input type="number" step="0.01" required placeholder="19.99" value={cost} onChange={e => setCost(e.target.value)} style={inputStyle} /></label>
              <label><span style={labelStyle}>Category</span>
                <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                  {['Developer Tools', 'Media & Entertainment', 'Cloud Infrastructure', 'Health & Fitness', 'Productivity'].map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', background: 'none', border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
