import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

const initialProfile = {
  name: '', email: '', password: '',
  monthlyIncome: '', currentSavings: '', monthlyExpenses: '',
  savingsGoal: '', debtBalance: '', currency: 'USD',
  occupation: '', riskPreference: 'balanced'
};

function demoProfile() {
  return {
    name: 'Finerva Demo User', email: `demo-${Date.now()}@example.test`,
    password: 'Finerva-Demo-2026!', monthlyIncome: '4200',
    currentSavings: '8500', monthlyExpenses: '2100', savingsGoal: '600',
    debtBalance: '0', currency: 'USD', occupation: 'Student', riskPreference: 'balanced'
  };
}

function GoogleIdentityButton({ onCredential, disabled }) {
  const buttonRef = useRef(null);
  const onCredentialRef = useRef(onCredential);
  const [error, setError] = useState('');
  onCredentialRef.current = onCredential;

  useEffect(() => {
    if (!googleClientId) return undefined;
    let active = true;
    let script = document.querySelector('script[data-finerva-google-identity]');
    const renderButton = () => {
      if (!active || !buttonRef.current) return;
      const identity = window.google?.accounts?.id;
      if (!identity) { setError('Google sign-in could not be loaded.'); return; }
      identity.initialize({
        client_id: googleClientId,
        callback: (r) => { if (!r.credential) { setError('Google did not return a credential.'); return; } onCredentialRef.current(r.credential); },
        auto_select: false
      });
      identity.renderButton(buttonRef.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: 300 });
    };
    const handleLoad = () => { if (script) script.dataset.loaded = 'true'; renderButton(); };
    const handleError = () => setError('Google sign-in could not be loaded.');
    if (window.google?.accounts?.id) { renderButton(); }
    else if (script?.dataset.loaded === 'true') { handleError(); }
    else {
      if (!script) { script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.defer = true; script.dataset.finervaGoogleIdentity = 'true'; }
      script.addEventListener('load', handleLoad); script.addEventListener('error', handleError);
      if (!script.isConnected) document.head.appendChild(script);
    }
    return () => { active = false; script?.removeEventListener('load', handleLoad); script?.removeEventListener('error', handleError); buttonRef.current?.replaceChildren(); };
  }, []);

  return (
    <div className={disabled ? 'pointer-events-none opacity-50' : ''}>
      {googleClientId
        ? <div ref={buttonRef} aria-label="Continue with Google" />
        : <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Google sign-in requires <code>VITE_GOOGLE_CLIENT_ID</code>.</p>}
      {error && <p role="alert" style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{error}</p>}
    </div>
  );
}

function Field({ label, className = '', ...props }) {
  return (
    <label className={className} style={{ display: 'block' }}>
      <span style={{ display: 'block', marginBottom: 5, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>{label}</span>
      <input style={{
        width: '100%', padding: '9px 12px', fontSize: 14, color: 'var(--ink)',
        background: 'var(--surface-2)', border: '1px solid transparent',
        borderRadius: 8, outline: 'none', transition: 'border-color 0.2s',
        fontFamily: 'inherit'
      }}
        onFocus={e => e.target.style.borderColor = 'var(--accent-mid)'}
        onBlur={e => e.target.style.borderColor = 'transparent'}
        {...props}
      />
    </label>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', marginBottom: 5, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>{label}</span>
      <select style={{
        width: '100%', padding: '9px 12px', fontSize: 14, color: 'var(--ink)',
        background: 'var(--surface-2)', border: '1px solid transparent',
        borderRadius: 8, outline: 'none', fontFamily: 'inherit', appearance: 'auto'
      }} {...props}>{children}</select>
    </label>
  );
}

export function UserAuthPage({ onAuthenticated, onGoogleAuthenticated, startupError = '' }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialProfile);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleCredential, setGoogleCredential] = useState('');
  const registering = mode === 'register';
  const update = e => setForm(c => ({ ...c, [e.target.name]: e.target.value }));

  const autofillDemo = () => { setForm(demoProfile()); setGoogleCredential(''); setMode('register'); setError(''); };

  const signInWithGoogle = async (credential) => {
    setBusy(true); setError('');
    try {
      const result = await onGoogleAuthenticated(credential);
      if (result.requiresProfile) { setGoogleCredential(credential); setForm(c => ({ ...c, name: result.name, email: result.email, password: '' })); setMode('register'); }
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      if (googleCredential) {
        const { monthlyIncome, currentSavings, monthlyExpenses, savingsGoal, debtBalance, currency, occupation, riskPreference } = form;
        await onGoogleAuthenticated(googleCredential, { monthlyIncome, currentSavings, monthlyExpenses, savingsGoal, debtBalance, currency, occupation, riskPreference });
      } else {
        await onAuthenticated(mode, registering ? form : { email: form.email, password: form.password });
      }
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Left panel — editorial */}
      <div style={{ display: 'none', flex: '0 0 420px', background: 'var(--accent)', padding: '48px 44px', flexDirection: 'column', justifyContent: 'space-between' }} className="auth-left">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.12)', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
              <Zap size={16} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>Finerva</span>
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>Personal Finance</p>
          <h1 style={{ margin: 0, fontSize: 38, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#fff', fontFamily: "'DM Serif Display', Georgia, serif" }}>
            A clearer view of your <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.65)' }}>financial life.</em>
          </h1>
          <p style={{ marginTop: 20, fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
            Set up your personal money snapshot and get a dashboard that starts with the details you choose to share.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Your profile, your numbers', 'Helpful money guidance', 'Goals that stay in view', 'Built for everyday decisions'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>Educational planning tool. Not a bank or investment service.</p>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          {/* Mobile brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
            <div style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 7, display: 'grid', placeItems: 'center' }}>
              <Zap size={15} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.03em' }}>Finerva</span>
          </div>

          <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
            {registering ? 'Create your account' : 'Sign in'}
          </h2>
          <p style={{ margin: '0 0 28px', fontSize: 13, color: 'var(--ink-3)' }}>
            {registering ? 'Your profile powers your personal dashboard.' : 'Continue to your Finerva dashboard.'}
          </p>

          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: 28, gap: 0 }}>
            {['login', 'register'].map(tab => (
              <button key={tab} type="button"
                onClick={() => { setMode(tab); setError(''); if (tab === 'login') setGoogleCredential(''); }}
                style={{
                  padding: '10px 20px', fontSize: 13, fontWeight: 600, border: 'none', background: 'none',
                  cursor: 'pointer', color: mode === tab ? 'var(--accent)' : 'var(--ink-3)',
                  borderBottom: mode === tab ? '2px solid var(--accent)' : '2px solid transparent',
                  marginBottom: -2, transition: 'color 0.15s', fontFamily: 'inherit'
                }}>
                {tab === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {/* Demo fill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, padding: '10px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Want to explore first?</span>
            <button type="button" onClick={autofillDemo} style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-mid)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
              Fill demo details →
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 24 }}>Sample values only — review before submitting.</p>

          {startupError && (
            <div style={{ padding: '10px 14px', background: 'var(--amber-light)', border: '1px solid #f0c070', borderRadius: 6, marginBottom: 20, fontSize: 13, color: 'var(--amber)' }}>{startupError}</div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {registering && (
              <>
                <Field label="Full name" name="name" autoComplete="name" maxLength={80} value={form.name} onChange={update} readOnly={Boolean(googleCredential)} required />
                {googleCredential && <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: -8 }}>Name and email from your Google account.</p>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Monthly income" name="monthlyIncome" type="number" min="0" max="1000000000" step="0.01" value={form.monthlyIncome} onChange={update} placeholder="4200" required />
                  <Field label="Current savings" name="currentSavings" type="number" min="0" max="1000000000" step="0.01" value={form.currentSavings} onChange={update} placeholder="8500" required />
                  <Field label="Monthly expenses" name="monthlyExpenses" type="number" min="0" max="1000000000" step="0.01" value={form.monthlyExpenses} onChange={update} placeholder="2100" required />
                  <Field label="Monthly savings goal" name="savingsGoal" type="number" min="0" max="1000000000" step="0.01" value={form.savingsGoal} onChange={update} placeholder="600" required />
                  <Field label="Total debt balance" name="debtBalance" type="number" min="0" max="1000000000" step="0.01" value={form.debtBalance} onChange={update} placeholder="0" required />
                  <SelectField label="Currency" name="currency" value={form.currency} onChange={update}>
                    <option value="USD">USD — US Dollar</option>
                    <option value="INR">INR — Indian Rupee</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — Pound Sterling</option>
                  </SelectField>
                  <Field label="Occupation" name="occupation" maxLength={80} value={form.occupation} onChange={update} placeholder="e.g. Student" required />
                  <SelectField label="Risk preference" name="riskPreference" value={form.riskPreference} onChange={update}>
                    <option value="conservative">Conservative</option>
                    <option value="balanced">Balanced</option>
                    <option value="growth">Growth-focused</option>
                  </SelectField>
                </div>
              </>
            )}
            <Field label="Email address" name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={update} readOnly={Boolean(googleCredential)} required />
            {!googleCredential && <Field label="Password (10+ characters)" name="password" type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 10 : undefined} maxLength={128} value={form.password} onChange={update} required />}

            {error && (
              <div style={{ padding: '10px 14px', background: 'var(--red-light)', border: '1px solid #f0b0a8', borderRadius: 6, fontSize: 13, color: 'var(--red)' }} role="alert">{error}</div>
            )}

            <button disabled={busy} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 20px', background: busy ? 'var(--accent-mid)' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600,
              cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1, fontFamily: 'inherit',
              transition: 'background 0.15s'
            }}>
              {busy ? 'Connecting…' : googleCredential ? 'Save profile and continue' : registering ? 'Create account' : 'Sign in'}
              {!busy && <ArrowRight size={15} />}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', color: 'var(--ink-3)', fontSize: 11 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <GoogleIdentityButton onCredential={signInWithGoogle} disabled={busy} />

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Your data is stored by this demo service.</span>
            <Link to="/admin/login" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-mid)', textDecoration: 'none' }}>Admin sign-in</Link>
          </div>
        </div>
      </div>

      <style>{`.auth-left { display: flex !important; } @media (max-width: 768px) { .auth-left { display: none !important; } }`}</style>
    </div>
  );
}

export function AdminAuthPage({ onAuthenticated, startupError = '' }) {
  const [email, setEmail] = useState('admin@finerva.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { await onAuthenticated({ email, password }); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          <div style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 7, display: 'grid', placeItems: 'center' }}>
            <Zap size={15} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.03em' }}>Finerva</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ShieldCheck size={16} color="var(--amber)" />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--amber)' }}>Restricted access</span>
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Administrator sign-in</h2>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--ink-3)' }}>Use the administrator credentials configured for the backend service.</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, padding: '10px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Demo credentials available</span>
          <button type="button" onClick={() => setPassword('FinervaAdmin!2026')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
            Fill demo password →
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 24 }}>Default: admin@finerva.local · FinervaAdmin!2026</p>

        {startupError && (
          <div style={{ padding: '10px 14px', background: 'var(--amber-light)', border: '1px solid #f0c070', borderRadius: 6, marginBottom: 20, fontSize: 13, color: 'var(--amber)' }}>{startupError}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Administrator email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required />
          <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && (
            <div style={{ padding: '10px 14px', background: 'var(--red-light)', border: '1px solid #f0b0a8', borderRadius: 6, fontSize: 13, color: 'var(--red)' }} role="alert">{error}</div>
          )}
          <button disabled={busy} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 20px', background: '#92400e', color: '#fff', border: 'none',
            borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: busy ? 'wait' : 'pointer',
            opacity: busy ? 0.7 : 1, fontFamily: 'inherit'
          }}>
            {busy ? 'Verifying…' : 'Sign in to controls'} {!busy && <ArrowRight size={15} />}
          </button>
        </form>

        <Link to="/login" style={{ display: 'block', marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none' }}>← Back to Finerva sign-in</Link>
      </div>
    </div>
  );
}
