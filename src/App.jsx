import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AdminControlView } from './components/AdminControlView';
import { AdminAuthPage, UserAuthPage } from './components/AuthPages';
import { AssistantWidget } from './components/AssistantWidget';
import { BudgetView } from './components/BudgetView';
import { CalculatorsView } from './components/CalculatorsView';
import { DashboardView } from './components/DashboardView';
import { GoalsView } from './components/GoalsView';
import { AIChatView } from './components/AIChatView';
import { MarketView } from './components/MarketView';
import { Navbar } from './components/Navbar';
import { SecurityView } from './components/SecurityView';
import { StudentPerksView } from './components/StudentPerksView';
import { SubscriptionsView } from './components/SubscriptionsView';
import {
  initialBudgets,
  initialGoals,
  initialSubscriptions,
  initialTransactions
} from './data/mockData';
import { api } from './services/api';

function getDashboardUser(account) {
  const profile = account?.profile || {};
  return {
    name: account?.name || 'Finerva user',
    email: account?.email || '',
    team: 'Team 07 (WOBBLE)',
    currency: profile.currency || 'USD',
    monthlyIncome: profile.monthlyIncome || 0,
    currentSavings: profile.currentSavings || 0,
    monthlyExpenses: profile.monthlyExpenses || 0,
    netWorth: (profile.currentSavings || 0) - (profile.debtBalance || 0),
    monthlySavingsTarget: profile.savingsGoal || 0,
    healthScore: null
  };
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(() => sessionStorage.getItem('finerva-token') || '');
  const [account, setAccount] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(Boolean(sessionStorage.getItem('finerva-token')));
  const [sessionError, setSessionError] = useState('');
  const [financeReady, setFinanceReady] = useState(false);
  const [financeError, setFinanceError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [goals, setGoals] = useState(initialGoals);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);

  useEffect(() => {
    let cancelled = false;
    const savedToken = sessionStorage.getItem('finerva-token');
    if (!savedToken) {
      setSessionLoading(false);
      return undefined;
    }
    api.me(savedToken).then((session) => {
      if (!cancelled) {
        setToken(savedToken);
        setAccount({ ...session.user, role: session.role });
      }
    }).catch((requestError) => {
      if (!cancelled) {
        sessionStorage.removeItem('finerva-token');
        setToken('');
        setAccount(null);
        setSessionError(`Your saved session could not be restored (${requestError.message}). Sign in again to continue.`);
      }
    }).finally(() => {
      if (!cancelled) setSessionLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (account?.role !== 'user' || !token) {
      setFinanceReady(false);
      return undefined;
    }
    let cancelled = false;
    setFinanceError('');
    api.getFinance(token).then((finance) => {
      if (cancelled) return;
      setTransactions(finance.transactions);
      setBudgets(finance.budgets);
      setGoals(finance.goals);
      setSubscriptions(finance.subscriptions);
      setFinanceReady(true);
    }).catch((requestError) => {
      if (!cancelled) setFinanceError(`Could not load your saved finance data: ${requestError.message}`);
    });
    return () => { cancelled = true; };
  }, [account?.role, token]);

  useEffect(() => {
    if (!financeReady || account?.role !== 'user' || !token) return undefined;
    const timer = window.setTimeout(async () => {
      setSyncing(true);
      setFinanceError('');
      try {
        await api.saveFinance(token, { transactions, budgets, goals, subscriptions });
      } catch (requestError) {
        setFinanceError(`Could not save your finance changes: ${requestError.message}`);
      } finally {
        setSyncing(false);
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [account?.role, budgets, financeReady, goals, subscriptions, token, transactions]);

  useEffect(() => {
    if (sessionLoading || !account) return;
    if (account.role === 'admin' && location.pathname !== '/admin') navigate('/admin', { replace: true });
    else if (account.role === 'user' && location.pathname.startsWith('/admin')) navigate('/dashboard', { replace: true });
    else if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/admin/login') navigate('/dashboard', { replace: true });
  }, [account, location.pathname, navigate, sessionLoading]);

  const authenticated = async (mode, credentials) => {
    setSessionError('');
    const result = mode === 'admin'
      ? await api.adminLogin(credentials)
      : mode === 'register'
        ? await api.register(credentials)
        : await api.login(credentials);
    sessionStorage.setItem('finerva-token', result.token);
    setToken(result.token);
    setAccount({ ...result.user, role: result.role });
    navigate(result.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  const googleAuthenticated = async (credential, profile) => {
    setSessionError('');
    const result = await api.googleLogin({
      credential,
      ...(profile ? { profile } : {})
    });
    if (result.requiresProfile) return result;
    sessionStorage.setItem('finerva-token', result.token);
    setToken(result.token);
    setAccount({ ...result.user, role: result.role });
    navigate('/dashboard', { replace: true });
    return result;
  };

  const signOut = async () => {
    try {
      await api.logout(token);
    } catch (requestError) {
      setSessionError(`Sign-out could not be confirmed by the backend: ${requestError.message}`);
    } finally {
      sessionStorage.removeItem('finerva-token');
      setToken('');
      setAccount(null);
      navigate(account?.role === 'admin' ? '/admin/login' : '/login', { replace: true });
    }
  };

  const user = useMemo(() => getDashboardUser(account), [account]);
  const addTransaction = (transaction) => {
    setTransactions((current) => [transaction, ...current]);
    if (transaction.type === 'debit') {
      setBudgets((current) => current.map((budget) => budget.category === transaction.category
        ? { ...budget, spent: budget.spent + transaction.amount }
        : budget));
    }
  };

  if (sessionLoading) {
    return <main className="grid min-h-screen place-items-center bg-[#080c15] text-sm text-slate-400">Connecting to Finerva securely…</main>;
  }

  if (account?.role === 'admin') {
    return location.pathname === '/admin/login'
      ? <Navigate to="/admin" replace />
      : <AdminControlView token={token} onLogout={signOut} />;
  }

  if (account?.role !== 'user') {
    if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
      return <Navigate to="/admin/login" replace />;
    }
    return location.pathname === '/admin/login'
      ? <AdminAuthPage startupError={sessionError} onAuthenticated={(credentials) => authenticated('admin', credentials)} />
      : <UserAuthPage
        startupError={sessionError}
        onAuthenticated={(mode, credentials) => authenticated(mode, credentials)}
        onGoogleAuthenticated={googleAuthenticated}
      />;
  }

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'chat':
        return <AIChatView user={user} token={token} />;
      case 'budgets':
        return <BudgetView budgets={budgets} onUpdateBudget={setBudgets} user={user} />;
      case 'goals':
        return <GoalsView goals={goals} onUpdateGoals={setGoals} user={user} />;
      case 'subscriptions':
        return <SubscriptionsView subscriptions={subscriptions} onUpdateSubscriptions={setSubscriptions} user={user} />;
      case 'calculators':
        return <CalculatorsView />;
      case 'market':
        return <MarketView />;
      case 'student':
        return <StudentPerksView />;
      case 'security':
        return <SecurityView user={user} transactions={transactions} budgets={budgets} goals={goals} />;
      default:
        return <DashboardView
          user={user}
          transactions={transactions}
          onAddTransaction={addTransaction}
          goals={goals}
          budgets={budgets}
          onOpenAI={() => setCurrentTab('chat')}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100">
      <Navbar
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      user={user}
      healthScore={user.healthScore}
      onLogout={signOut}
      />
      <main className="min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
          {financeError && <p role="alert" className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{financeError}</p>}
          {syncing && <p role="status" className="mb-4 text-right text-xs text-slate-500">Saving your finance data…</p>}
          {!financeReady ? <div className="grid min-h-[55vh] place-items-center text-sm text-slate-400">{financeError ? 'Saved profile data is unavailable.' : 'Loading your dashboard…'}</div> : renderCurrentTab()}
        </div>
      </main>
      <AssistantWidget token={token} />
    </div>
  );
}
