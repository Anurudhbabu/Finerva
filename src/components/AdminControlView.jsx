import { useCallback, useEffect, useState } from 'react';
import { Activity, Bot, RefreshCw, ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import { api } from '../services/api';

export function AdminControlView({ token, onLogout }) {
  const [overview, setOverview] = useState(null);
  const [settings, setSettings] = useState(null);
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    try {
      const [nextOverview, nextSettings] = await Promise.all([
        api.adminOverview(token),
        api.adminSettings(token)
      ]);
      setOverview(nextOverview);
      setSettings(nextSettings);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  const changeSettings = async (nextSettings, key) => {
    setBusyKey(key);
    setError('');
    setNotice('');
    try {
      setSettings(await api.updateAdminSettings(token, nextSettings));
      setNotice('Service settings saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey('');
    }
  };

  const changeUser = async (user) => {
    setBusyKey(user.id);
    setError('');
    setNotice('');
    try {
      await api.updateUserStatus(token, user.id, !user.enabled);
      await refresh();
      setNotice(`${user.name}'s account has been ${user.enabled ? 'disabled' : 'enabled'}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey('');
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}'s Finerva account and saved finance data? This cannot be undone.`)) return;
    setBusyKey(user.id);
    setError('');
    setNotice('');
    try {
      await api.deleteUser(token, user.id);
      await refresh();
      setNotice(`${user.name}'s account and saved data were deleted.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey('');
    }
  };

  return (
    <main className="min-h-screen bg-[#080c15] px-4 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300 text-slate-950"><ShieldCheck size={22} /></span><div><p className="text-xs font-bold uppercase tracking-[.17em] text-amber-300">Finerva operations</p><h1 className="mt-1 text-2xl font-extrabold text-white">Admin controls</h1></div></div>
          <div className="flex items-center gap-2"><button onClick={refresh} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800"><RefreshCw size={15} /> Refresh</button><button onClick={onLogout} className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700">Sign out</button></div>
        </header>

        {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
        {notice && <p role="status" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Service overview">
          {[
            ['Accounts', overview?.userCount ?? '—', Users],
            ['Enabled accounts', overview?.enabledCount ?? '—', ShieldCheck],
            ['Disabled accounts', overview?.disabledCount ?? '—', ShieldAlert],
            ['API service', 'Connected', Activity]
          ].map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5"><div className="flex items-center justify-between text-xs font-semibold text-slate-400"><span>{label}</span><Icon size={17} className="text-emerald-300" /></div><p className="mt-4 text-2xl font-extrabold text-white">{value}</p></article>)}
        </section>

        <section className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/75 p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><Bot size={19} /></span><div><h2 className="font-bold text-white">Service controls</h2><p className="mt-1 text-xs text-slate-400">Changes are saved by the backend and apply to user requests.</p></div></div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              { key: 'aiAssistantEnabled', title: 'Financial assistant', detail: 'Allow users to send questions to the Finerva advisor.' },
              { key: 'maintenanceMode', title: 'Maintenance mode', detail: 'Show service maintenance status to user accounts.' }
            ].map(({ key, title, detail }) => <div key={key} className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div><p className="text-sm font-semibold text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p><span className={`mt-2 inline-block text-xs font-bold ${settings?.[key] ? 'text-emerald-300' : 'text-slate-500'}`}>{settings ? settings[key] ? 'Enabled' : 'Disabled' : 'Loading…'}</span></div><button disabled={!settings || !!busyKey} onClick={() => changeSettings({ [key]: !settings[key] }, key)} role="switch" aria-checked={Boolean(settings?.[key])} aria-label={`Toggle ${title}`} className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${settings?.[key] ? 'bg-emerald-400' : 'bg-slate-700'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${settings?.[key] ? 'left-6' : 'left-1'}`} /></button></div>)}
          </div>
        </section>

        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/75">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4"><div><h2 className="font-bold text-white">User access</h2><p className="mt-1 text-xs text-slate-400">Email addresses are masked. Disable access when a demo account should no longer sign in.</p></div><span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{overview?.users.length ?? 0} accounts</span></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3 font-semibold">Name</th><th className="px-5 py-3 font-semibold">Email</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 text-right font-semibold">Access</th></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {overview?.users.map((user) => <tr key={user.id}><td className="px-5 py-4 font-semibold text-white">{user.name}</td><td className="px-5 py-4 text-slate-400">{user.email}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${user.enabled ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-200'}`}>{user.enabled ? 'Enabled' : 'Disabled'}</span></td><td className="space-x-2 px-5 py-4 text-right"><button disabled={!!busyKey} onClick={() => changeUser(user)} className={`rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50 ${user.enabled ? 'bg-rose-400/10 text-rose-200 hover:bg-rose-400/20' : 'bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'}`}>{busyKey === user.id ? 'Saving…' : user.enabled ? 'Disable' : 'Enable'}</button><button disabled={!!busyKey} onClick={() => deleteUser(user)} className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-rose-400/15 hover:text-rose-200 disabled:opacity-50">Delete</button></td></tr>)}
                {overview && overview.users.length === 0 && <tr><td colSpan="4" className="px-5 py-10 text-center text-sm text-slate-500">No user accounts yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
        <p className="mt-6 text-xs leading-5 text-slate-500">Admin controls are protected by a server-side role check. Financial profile details and password hashes are not exposed in this user list.</p>
      </div>
    </main>
  );
}
