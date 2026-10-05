import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, WalletCards, Zap } from 'lucide-react';

const initialProfile = {
  name: '',
  email: '',
  password: '',
  monthlyIncome: '',
  currentSavings: '',
  monthlyExpenses: '',
  savingsGoal: '',
  debtBalance: '',
  currency: 'USD',
  occupation: '',
  riskPreference: 'balanced'
};

function Brand() {
  return (
    <Link to="/login" className="flex items-center gap-3" aria-label="Finerva home">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20">
        <Zap size={21} fill="currentColor" />
      </span>
      <span className="text-2xl font-extrabold tracking-tight text-white">Finerva</span>
    </Link>
  );
}

function AuthFrame({ children, subtitle }) {
  return (
    <main className="min-h-screen bg-[#080c15] px-4 py-8 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
        <Brand />
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_1.05fr]">
          <section className="hidden max-w-lg lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck size={15} /> Private by design
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
              A clearer view of your <span className="text-emerald-300">financial life.</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-400">{subtitle}</p>
            <div className="mt-9 grid grid-cols-2 gap-3">
              {['Your profile, your numbers', 'Helpful money guidance', 'Goals that stay in view', 'Built for everyday decisions'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
                  <span className="mb-3 block h-2 w-2 rounded-full bg-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </section>
          {children}
        </div>
        <p className="text-center text-xs text-slate-500">Finerva is an educational planning tool, not a bank or investment service.</p>
      </div>
    </main>
  );
}

function Field({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-300">{label}</span>
      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
        {...props}
      />
    </label>
  );
}

export function UserAuthPage({ onAuthenticated, startupError = '' }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialProfile);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const registering = mode === 'register';

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onAuthenticated(mode, registering ? form : { email: form.email, password: form.password });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame subtitle="Set up your personal money snapshot and get a dashboard that starts with the details you choose to share.">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300"><WalletCards size={21} /></span>
          <div><h2 className="text-xl font-bold text-white">{registering ? 'Create your Finerva account' : 'Welcome back'}</h2><p className="mt-1 text-xs text-slate-400">{registering ? 'Your profile powers your personal dashboard.' : 'Sign in to continue to your dashboard.'}</p></div>
        </div>
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-950 p-1">
          {['login', 'register'].map((tab) => (
            <button key={tab} type="button" onClick={() => { setMode(tab); setError(''); }} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${mode === tab ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}>
              {tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          {startupError && <p role="alert" className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3.5 py-3 text-sm text-amber-100">{startupError}</p>}
          {registering && (
            <>
              <Field label="Full name" name="name" autoComplete="name" maxLength={80} value={form.name} onChange={update} required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Monthly income" name="monthlyIncome" type="number" min="0" max="1000000000" step="0.01" value={form.monthlyIncome} onChange={update} placeholder="e.g. 4200" required />
                <Field label="Current savings" name="currentSavings" type="number" min="0" max="1000000000" step="0.01" value={form.currentSavings} onChange={update} placeholder="e.g. 8500" required />
                <Field label="Monthly expenses" name="monthlyExpenses" type="number" min="0" max="1000000000" step="0.01" value={form.monthlyExpenses} onChange={update} placeholder="e.g. 2100" required />
                <Field label="Monthly savings goal" name="savingsGoal" type="number" min="0" max="1000000000" step="0.01" value={form.savingsGoal} onChange={update} placeholder="e.g. 600" required />
                <Field label="Total debt balance" name="debtBalance" type="number" min="0" max="1000000000" step="0.01" value={form.debtBalance} onChange={update} placeholder="0 if none" required />
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Currency</span><select name="currency" value={form.currency} onChange={update} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="USD">USD — US Dollar</option><option value="INR">INR — Indian Rupee</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — Pound Sterling</option></select></label>
                <Field label="Occupation or student status" name="occupation" maxLength={80} value={form.occupation} onChange={update} placeholder="e.g. Student, designer" required />
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Risk preference</span><select name="riskPreference" value={form.riskPreference} onChange={update} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="conservative">Conservative</option><option value="balanced">Balanced</option><option value="growth">Growth-focused</option></select></label>
              </div>
            </>
          )}
          <Field label="Email address" name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={update} required />
          <Field label="Password (10+ characters)" name="password" type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 10 : undefined} maxLength={128} value={form.password} onChange={update} required />
          {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3.5 py-3 text-sm text-rose-200">{error}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Connecting securely…' : registering ? 'Create my account' : 'Sign in'} {!busy && <ArrowRight size={17} />}
          </button>
        </form>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5 text-xs text-slate-500">
          <span>Your data is stored by this demo service.</span>
          <Link to="/admin/login" className="font-semibold text-emerald-300 hover:text-emerald-200">Administrator sign-in</Link>
        </div>
      </section>
    </AuthFrame>
  );
}

export function AdminAuthPage({ onAuthenticated, startupError = '' }) {
  const [email, setEmail] = useState('admin@finerva.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onAuthenticated({ email, password });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame subtitle="A separate, role-protected workspace for managing service settings and user access.">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/10 text-amber-300"><ShieldCheck size={23} /></div>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Restricted access</p>
        <h2 className="mt-2 text-2xl font-extrabold text-white">Administrator sign-in</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Use the administrator credentials configured for the backend service.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {startupError && <p role="alert" className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3.5 py-3 text-sm text-amber-100">{startupError}</p>}
          <Field label="Administrator email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3.5 py-3 text-sm text-rose-200">{error}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3.5 text-sm font-bold text-slate-950 hover:bg-amber-200 disabled:opacity-60">{busy ? 'Verifying…' : 'Sign in to controls'} <ArrowRight size={17} /></button>
        </form>
        <Link to="/login" className="mt-6 block text-center text-sm font-semibold text-slate-400 hover:text-white">Back to Finerva sign-in</Link>
      </section>
    </AuthFrame>
  );
}
