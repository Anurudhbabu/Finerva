import {
  BarChart3, Bot, Calculator, ChevronLeft, ChevronRight, GraduationCap, LayoutDashboard,
  LogOut, PieChart, Repeat, ShieldCheck, Target, TrendingUp, Zap
} from 'lucide-react';

const items = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'chat', label: 'AI advisor', icon: Bot },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'goals', label: 'Savings goals', icon: Target },
  { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
  { id: 'calculators', label: 'Calculators', icon: Calculator },
  { id: 'market', label: 'Markets', icon: TrendingUp },
  { id: 'student', label: 'Student perks', icon: GraduationCap },
  { id: 'security', label: 'Security', icon: ShieldCheck }
];

export function QuickActionsSidebar({ active, onSelect, user, expanded, onToggle, onLogout }) {
  return (
    <aside className={`fixed bottom-3 left-3 top-3 z-40 flex flex-col rounded-3xl border border-slate-800 bg-[#0b1220]/95 py-4 shadow-2xl shadow-black/35 backdrop-blur-xl transition-[width] duration-200 ${expanded ? 'w-64 px-3' : 'w-[76px] px-2'}`}>
      <div className={`flex items-center ${expanded ? 'justify-between px-2' : 'justify-center'}`}>
        <button onClick={() => onSelect('dashboard')} aria-label="Finerva dashboard" className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-500 text-slate-950"><Zap size={21} fill="currentColor" /></span>
          {expanded && <span className="truncate text-lg font-extrabold tracking-tight text-white">Finerva</span>}
        </button>
        {expanded && <button onClick={onToggle} aria-label="Collapse quick actions" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><ChevronLeft size={18} /></button>}
      </div>
      {!expanded && <button onClick={onToggle} aria-label="Expand quick actions" className="mx-auto mt-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><ChevronRight size={18} /></button>}
      <p className={`mb-2 mt-7 text-[10px] font-bold uppercase tracking-[.16em] text-slate-500 ${expanded ? 'px-3' : 'text-center'}`}>{expanded ? 'Quick actions' : 'Actions'}</p>
      <nav aria-label="Dashboard quick actions" className="flex-1 space-y-1 overflow-y-auto">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} title={expanded ? undefined : label} aria-label={label} aria-current={active === id ? 'page' : undefined} onClick={() => onSelect(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active === id ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/20' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'} ${expanded ? '' : 'justify-center px-0'}`}>
            <Icon size={19} className="shrink-0" />{expanded && <span className="truncate">{label}</span>}
          </button>
        ))}
      </nav>
      <div className={`mt-3 border-t border-slate-800 pt-3 ${expanded ? 'px-1' : ''}`}>
        <div className={`mb-2 flex items-center gap-3 rounded-xl p-2 ${expanded ? '' : 'justify-center'}`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-700 text-xs font-bold text-white">{user.name.split(/\s+/).map((word) => word[0]).slice(0, 2).join('').toUpperCase()}</span>
          {expanded && <span className="min-w-0"><span className="block truncate text-xs font-semibold text-white">{user.name}</span><span className="block truncate text-[10px] text-slate-500">{user.email}</span></span>}
        </div>
        <button onClick={onLogout} title={expanded ? undefined : 'Sign out'} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 hover:bg-rose-400/10 hover:text-rose-200 ${expanded ? '' : 'justify-center px-0'}`}><LogOut size={17} />{expanded && 'Sign out'}</button>
      </div>
    </aside>
  );
}
