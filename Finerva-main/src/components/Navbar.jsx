import { Briefcase, Calculator, GraduationCap, LayoutDashboard, LogOut, PieChart, Repeat, ShieldCheck, Target, TrendingUp, Zap } from 'lucide-react';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'Advisory', icon: Briefcase },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
  { id: 'calculators', label: 'Calculators', icon: Calculator },
  { id: 'market', label: 'Markets', icon: TrendingUp },
  { id: 'student', label: 'Student Perks', icon: GraduationCap },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export const Navbar = ({ currentTab, setCurrentTab, user, onLogout }) => (
  <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', boxShadow: '0 1px 6px rgba(91,106,191,0.07)' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 0 }}>

      {/* Brand */}
      <button onClick={() => setCurrentTab('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '0 20px 0 0', borderRight: '1px solid var(--border)', marginRight: 20, flexShrink: 0 }}>
        <div style={{ width: 26, height: 26, background: 'var(--accent)', borderRadius: 6, display: 'grid', placeItems: 'center' }}>
          <Zap size={13} color="#fff" fill="#fff" />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.03em' }}>Finerva</span>
      </button>

      {/* Nav tabs — desktop */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflowX: 'auto' }} className="hide-scrollbar">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = currentTab === id;
          return (
            <button key={id} onClick={() => setCurrentTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--accent)' : 'var(--ink-3)',
              background: active ? 'var(--accent-light)' : 'none', border: 'none',
              borderRadius: 5, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
              transition: 'color 0.12s, background 0.12s'
            }}>
              <Icon size={14} />
              <span className="nav-label">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 20, borderLeft: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }} className="user-info">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
        </div>
        <button onClick={onLogout} title="Sign out" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 6,
          background: 'none', cursor: 'pointer', color: 'var(--ink-3)', transition: 'color 0.12s, border-color 0.12s'
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = '#f0b0a8'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
          <LogOut size={14} />
        </button>
      </div>
    </div>

    {/* Mobile nav row */}
    <div style={{ borderTop: '1px solid var(--border)', overflowX: 'auto', display: 'none' }} className="mobile-nav hide-scrollbar">
      <div style={{ display: 'flex', padding: '0 16px', gap: 2, minWidth: 'max-content' }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = currentTab === id;
          return (
            <button key={id} onClick={() => setCurrentTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '8px 10px',
              fontSize: 12, fontWeight: active ? 600 : 400, color: active ? 'var(--accent)' : 'var(--ink-3)',
              background: 'none', border: 'none', borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit'
            }}>
              <Icon size={13} />{label}
            </button>
          );
        })}
      </div>
    </div>

    <style>{`
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      @media (max-width: 900px) { .nav-label { display: none; } .user-info { display: none; } }
      @media (max-width: 640px) { .mobile-nav { display: block !important; } }
    `}</style>
  </header>
);
