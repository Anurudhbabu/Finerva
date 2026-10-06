import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Clock, Filter, PiggyBank, PlusCircle, TrendingUp, Wallet, X } from 'lucide-react';

const CATEGORIES = ['All', 'Income', 'Housing', 'Food & Dining', 'Investments', 'Subscriptions', 'Utilities', 'Entertainment'];
const TX_CATEGORIES = CATEGORIES.slice(1);

export const DashboardView = ({ user, transactions, onAddTransaction, goals, budgets, onOpenAI }) => {
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food & Dining');
  const [newType, setNewType] = useState('debit');

  const money = a => new Intl.NumberFormat(undefined, { style: 'currency', currency: user.currency || 'USD', maximumFractionDigits: 0 }).format(a);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const filtered = filter === 'All' ? transactions : transactions.filter(t => t.category === filter);

  const handleCreate = e => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;
    onAddTransaction({ id: 'tx-' + Date.now(), title: newTitle, amount: parseFloat(newAmount), type: newType, category: newCategory, date: new Date().toISOString().split('T')[0], merchant: 'Direct Entry' });
    setNewTitle(''); setNewAmount(''); setShowModal(false);
  };

  const metrics = [
    { label: 'Current Savings', value: money(user.currentSavings || 0), sub: 'Balance on file', color: 'var(--accent)', bg: 'var(--accent-light)', icon: <Wallet size={16} /> },
    { label: 'Monthly Expenses', value: money(user.monthlyExpenses || 0), sub: user.monthlyIncome > 0 ? `${Math.round((user.monthlyExpenses / user.monthlyIncome) * 100)}% of income` : 'On file', color: 'var(--red)', bg: 'var(--red-light)', icon: <ArrowUpRight size={16} /> },
    { label: 'Savings Goal', value: money(user.monthlySavingsTarget || 0), sub: 'Per month target', color: 'var(--blue)', bg: 'var(--blue-light)', icon: <PiggyBank size={16} /> },
    { label: 'Net Worth', value: money(user.netWorth || 0), sub: 'Savings minus debt', color: 'var(--amber)', bg: 'var(--amber-light)', icon: <TrendingUp size={16} /> },
  ];

  const inputStyle = { width: '100%', padding: '8px 11px', fontSize: 13, color: 'var(--ink)', background: 'var(--surface-2)', border: '1px solid transparent', borderRadius: 8, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 5 };

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{greeting}</p>
          <h1 style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>{user.name.split(' ')[0]}'s Dashboard</h1>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
          background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6,
          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
        }}>
          <PlusCircle size={15} /> Add Transaction
        </button>
      </div>

      {/* Metric row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: 'var(--surface)', borderRadius: 16, padding: '20px', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{m.label}</span>
              <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, background: m.bg, borderRadius: 6, color: m.color }}>{m.icon}</span>
            </div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>{m.value}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--ink-3)' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* Transactions */}
        <div style={{ background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--card-shadow)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Recent Activity</h2>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)' }}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={13} color="var(--ink-3)" />
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{ fontSize: 12, color: 'var(--ink)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 8px', outline: 'none', fontFamily: 'inherit' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            {filtered.map((tx, i) => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 6, background: tx.type === 'credit' ? 'var(--accent-light)' : 'var(--surface-2)', display: 'grid', placeItems: 'center', color: tx.type === 'credit' ? 'var(--accent-mid)' : 'var(--ink-3)', flexShrink: 0 }}>
                    {tx.type === 'credit' ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{tx.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)' }}>{tx.merchant} · {tx.category}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tx.type === 'credit' ? 'var(--accent-mid)' : 'var(--ink)' }}>
                    {tx.type === 'credit' ? '+' : '−'}{money(tx.amount)}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                    <Clock size={10} />{tx.date}
                  </p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ padding: '24px 20px', fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>No transactions yet. Add one above.</p>}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Goals */}
          <div style={{ background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Goals Progress</h3>
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {goals.slice(0, 3).map(g => {
                const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <div key={g.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-mid)' }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-mid)', borderRadius: 9999, transition: 'width 0.4s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>{money(g.current)}</span>
                      <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>{money(g.target)}</span>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: 0 }}>No goals yet. Add one in Goals.</p>}
            </div>
          </div>

          {/* Monthly snapshot */}
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '20px', boxShadow: 'var(--card-shadow)' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Monthly snapshot</p>
            <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Income after expenses</p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              Your entered income minus monthly expenses is <strong style={{ color: 'var(--accent-mid)' }}>{money(Math.max(0, (user.monthlyIncome || 0) - (user.monthlyExpenses || 0)))}</strong> per month, before debt payments. This is not a forecast.
            </p>
            <button onClick={onOpenAI} style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: 'var(--accent-mid)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
              Financial Review →
            </button>
          </div>
        </div>
      </div>

      {/* Add transaction modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 10, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Add Transaction</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label><span style={labelStyle}>Description</span><input type="text" required placeholder="e.g. Grocery Shopping" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={inputStyle} /></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label><span style={labelStyle}>Amount ({user.currency || 'USD'})</span><input type="number" step="0.01" required placeholder="0.00" value={newAmount} onChange={e => setNewAmount(e.target.value)} style={inputStyle} /></label>
                <label><span style={labelStyle}>Type</span>
                  <select value={newType} onChange={e => setNewType(e.target.value)} style={inputStyle}>
                    <option value="debit">Expense</option>
                    <option value="credit">Income</option>
                  </select>
                </label>
              </div>
              <label><span style={labelStyle}>Category</span>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={inputStyle}>
                  {TX_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', background: 'none', border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr !important; } } @media (max-width: 640px) { .metric-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </div>
  );
};
