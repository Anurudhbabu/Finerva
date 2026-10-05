import { createServer } from 'node:http';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { readFile, mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scrypt = promisify(scryptCallback);
const root = path.dirname(fileURLToPath(import.meta.url));
const dataPath = process.env.FINERVA_DATA_FILE || path.join(root, 'data.json');
const port = Number(process.env.FINERVA_API_PORT || 5174);
const configuredAdminPassword = process.env.FINERVA_ADMIN_PASSWORD || 'FinervaAdmin!2026';
const sessions = new Map();
const attempts = new Map();
let writeQueue = Promise.resolve();
let store;
let adminPassword;

const blankStore = () => ({
  users: [],
  settings: { maintenanceMode: false, aiAssistantEnabled: true }
});

async function readStore() {
  try {
    const parsed = JSON.parse(await readFile(dataPath, 'utf8'));
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      settings: { ...blankStore().settings, ...(parsed.settings || {}) }
    };
  } catch (error) {
    if (error.code === 'ENOENT') return blankStore();
    throw new Error(`Could not read Finerva data store: ${error.message}`);
  }
}

function persistStore() {
  const snapshot = JSON.stringify(store, null, 2);
  writeQueue = writeQueue.then(async () => {
    await mkdir(path.dirname(dataPath), { recursive: true });
    const temporaryPath = `${dataPath}.tmp`;
    await writeFile(temporaryPath, snapshot, { encoding: 'utf8', mode: 0o600 });
    await rename(temporaryPath, dataPath);
  });
  return writeQueue;
}

function json(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(payload));
}

async function readBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 32_000) {
      const error = new Error('Request body is too large.');
      error.status = 413;
      throw error;
    }
  }
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    const error = new Error('Request body must be valid JSON.');
    error.status = 400;
    throw error;
  }
}

function requireString(value, label, maxLength = 120) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw Object.assign(new Error(`${label} is required and must be ${maxLength} characters or fewer.`), { status: 400 });
  }
  return value.trim();
}

function requireMoney(value, label) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000) {
    throw Object.assign(new Error(`${label} must be a valid non-negative amount.`), { status: 400 });
  }
  return Math.round(amount * 100) / 100;
}

function requireRecord(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw Object.assign(new Error(`${label} entries must be objects.`), { status: 400 });
  }
  return value;
}

function requireList(value, label, limit) {
  if (!Array.isArray(value) || value.length > limit) {
    throw Object.assign(new Error(`${label} must be a list with no more than ${limit} entries.`), { status: 400 });
  }
  return value;
}

function cleanText(value, label, maxLength = 100) {
  if (typeof value !== 'string' || value.length > maxLength) {
    throw Object.assign(new Error(`${label} must be text with no more than ${maxLength} characters.`), { status: 400 });
  }
  return value.trim();
}

function cleanFinance(body) {
  const transactions = requireList(body.transactions, 'Transactions', 500).map((entry) => {
    const item = requireRecord(entry, 'Transaction');
    if (!['credit', 'debit'].includes(item.type)) throw Object.assign(new Error('Transaction type must be credit or debit.'), { status: 400 });
    return {
      id: cleanText(item.id, 'Transaction ID', 80),
      title: requireString(item.title, 'Transaction title', 100),
      amount: requireMoney(item.amount, 'Transaction amount'),
      type: item.type,
      category: requireString(item.category, 'Transaction category', 80),
      date: cleanText(item.date, 'Transaction date', 30),
      merchant: cleanText(item.merchant || '', 'Merchant', 100)
    };
  });
  const budgets = requireList(body.budgets, 'Budgets', 100).map((entry) => {
    const item = requireRecord(entry, 'Budget');
    return {
      id: cleanText(item.id, 'Budget ID', 80),
      category: requireString(item.category, 'Budget category', 80),
      allocated: requireMoney(item.allocated, 'Budget allocation'),
      spent: requireMoney(item.spent, 'Budget spending'),
      color: cleanText(item.color || 'emerald', 'Budget color', 30)
    };
  });
  const goals = requireList(body.goals, 'Goals', 100).map((entry) => {
    const item = requireRecord(entry, 'Goal');
    return {
      id: cleanText(item.id, 'Goal ID', 80),
      title: requireString(item.title, 'Goal title', 100),
      target: requireMoney(item.target, 'Goal target'),
      current: requireMoney(item.current, 'Goal current amount'),
      category: requireString(item.category, 'Goal category', 80),
      deadline: cleanText(item.deadline || '', 'Goal deadline', 40),
      icon: cleanText(item.icon || '', 'Goal icon', 40)
    };
  });
  const subscriptions = requireList(body.subscriptions, 'Subscriptions', 100).map((entry) => {
    const item = requireRecord(entry, 'Subscription');
    return {
      id: cleanText(item.id, 'Subscription ID', 80),
      name: requireString(item.name, 'Subscription name', 100),
      cost: requireMoney(item.cost, 'Subscription cost'),
      billingCycle: requireString(item.billingCycle, 'Billing cycle', 30),
      nextBilling: cleanText(item.nextBilling || '', 'Next billing date', 40),
      category: requireString(item.category, 'Subscription category', 80),
      status: requireString(item.status, 'Subscription status', 40)
    };
  });
  return { transactions, budgets, goals, subscriptions };
}

function normalizedEmail(value) {
  const email = requireString(value, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw Object.assign(new Error('Enter a valid email address.'), { status: 400 });
  }
  return email;
}

async function passwordRecord(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return { salt, hash: hash.toString('hex') };
}

async function passwordMatches(password, salt, expectedHex) {
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = await scrypt(password, salt, expected.length);
  return expected.length > 0 && timingSafeEqual(actual, expected);
}

function publicUser(user) {
  const { passwordSalt, passwordHash, ...safeUser } = user;
  return safeUser;
}

function issueSession(user, role, response) {
  const token = randomBytes(32).toString('base64url');
  sessions.set(token, { userId: user.id, role });
  json(response, 200, { token, role, user: publicUser(user) });
}

function currentSession(request) {
  const authorization = request.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  return { token, session: sessions.get(token) };
}

function requireSession(request, role) {
  const { session } = currentSession(request);
  if (!session || (role && session.role !== role)) {
    throw Object.assign(new Error('Sign in with an authorized account to continue.'), { status: 401 });
  }
  const user = role === 'admin' ? null : store.users.find((candidate) => candidate.id === session.userId);
  if (role !== 'admin' && (!user || !user.enabled)) {
    throw Object.assign(new Error('This account is unavailable. Please contact an administrator.'), { status: 403 });
  }
  return { session, user };
}

function checkLoginLimit(request, key) {
  const identifier = `${request.socket.remoteAddress || 'local'}:${key}`;
  const now = Date.now();
  const recent = (attempts.get(identifier) || []).filter((time) => now - time < 15 * 60_000);
  if (recent.length >= 8) {
    throw Object.assign(new Error('Too many sign-in attempts. Try again in 15 minutes.'), { status: 429 });
  }
  recent.push(now);
  attempts.set(identifier, recent);
}

function adminUser() {
  return {
    id: 'finerva-admin',
    name: 'Finerva Administrator',
    email: 'admin@finerva.local',
    role: 'admin',
    enabled: true,
    createdAt: new Date().toISOString()
  };
}

function adminRequired(request) {
  return requireSession(request, 'admin');
}

async function handle(request, response) {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': request.headers.origin || 'http://localhost:5000',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Vary': 'Origin'
    });
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const body = ['POST', 'PATCH', 'PUT'].includes(request.method) ? await readBody(request) : {};

  if (request.method === 'GET' && url.pathname === '/api/health') {
    json(response, 200, { status: 'ok', service: 'Finerva API' });
    return;
  }

  if (store.settings.maintenanceMode
    && !url.pathname.startsWith('/api/admin/')
    && url.pathname !== '/api/auth/logout') {
    throw Object.assign(new Error('Finerva is temporarily in maintenance mode. Please try again later.'), { status: 503 });
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/register') {
    const name = requireString(body.name, 'Full name', 80);
    const email = normalizedEmail(body.email);
    checkLoginLimit(request, `register:${email}`);
    const password = requireString(body.password, 'Password', 128);
    if (password.length < 10) throw Object.assign(new Error('Use a password with at least 10 characters.'), { status: 400 });
    if (store.users.some((user) => user.email === email)) {
      throw Object.assign(new Error('An account with this email already exists.'), { status: 409 });
    }
    if (!['USD', 'INR', 'EUR', 'GBP'].includes(body.currency)) {
      throw Object.assign(new Error('Choose a supported currency.'), { status: 400 });
    }
    if (!['conservative', 'balanced', 'growth'].includes(body.riskPreference)) {
      throw Object.assign(new Error('Choose a supported risk preference.'), { status: 400 });
    }
    const profile = {
      monthlyIncome: requireMoney(body.monthlyIncome, 'Monthly income'),
      currentSavings: requireMoney(body.currentSavings, 'Current savings'),
      monthlyExpenses: requireMoney(body.monthlyExpenses, 'Monthly expenses'),
      savingsGoal: requireMoney(body.savingsGoal, 'Monthly savings goal'),
      debtBalance: requireMoney(body.debtBalance, 'Debt balance'),
      currency: body.currency,
      occupation: requireString(body.occupation, 'Occupation', 80),
      riskPreference: body.riskPreference
    };
    const credentials = await passwordRecord(password);
    const user = {
      id: randomBytes(16).toString('hex'),
      name,
      email,
      role: 'user',
      enabled: true,
      createdAt: new Date().toISOString(),
      profile,
      finance: { transactions: [], budgets: [], goals: [], subscriptions: [] },
      ...{ passwordSalt: credentials.salt, passwordHash: credentials.hash }
    };
    store.users.push(user);
    await persistStore();
    issueSession(user, 'user', response);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    const email = normalizedEmail(body.email);
    checkLoginLimit(request, email);
    const password = requireString(body.password, 'Password', 128);
    const user = store.users.find((candidate) => candidate.email === email);
    if (!user || !await passwordMatches(password, user.passwordSalt, user.passwordHash)) {
      throw Object.assign(new Error('Email or password is incorrect.'), { status: 401 });
    }
    if (!user.enabled) throw Object.assign(new Error('This account has been disabled. Contact an administrator.'), { status: 403 });
    issueSession(user, 'user', response);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/admin/login') {
    const email = normalizedEmail(body.email);
    checkLoginLimit(request, `admin:${email}`);
    const password = requireString(body.password, 'Password', 128);
    if (email !== 'admin@finerva.local' || !await passwordMatches(password, adminPassword.salt, adminPassword.hash)) {
      throw Object.assign(new Error('Administrator credentials are incorrect.'), { status: 401 });
    }
    issueSession(adminUser(), 'admin', response);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/me') {
    const { session, user } = requireSession(request);
    json(response, 200, { role: session.role, user: session.role === 'admin' ? adminUser() : publicUser(user) });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
    const { token } = currentSession(request);
    sessions.delete(token);
    json(response, 200, { status: 'signed out' });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/finance') {
    const { user } = requireSession(request, 'user');
    json(response, 200, user.finance || { transactions: [], budgets: [], goals: [], subscriptions: [] });
    return;
  }

  if (request.method === 'PUT' && url.pathname === '/api/finance') {
    const { user } = requireSession(request, 'user');
    user.finance = cleanFinance(body);
    await persistStore();
    json(response, 200, user.finance);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/chat') {
    const { user } = requireSession(request, 'user');
    const prompt = requireString(body.prompt, 'Message', 2000);
    if (!store.settings.aiAssistantEnabled) {
      throw Object.assign(new Error('The Finerva assistant is temporarily disabled by an administrator.'), { status: 503 });
    }
    const { profile } = user;
    const remaining = Math.max(0, profile.monthlyIncome - profile.monthlyExpenses);
    const currencyAmount = (amount) => new Intl.NumberFormat('en', {
      style: 'currency',
      currency: profile.currency,
      maximumFractionDigits: 0
    }).format(amount);
    const advice = /save|saving|budget|expense/i.test(prompt)
      ? `Good question, ${user.name.split(' ')[0]}. Based on the profile you entered, your monthly income is ${currencyAmount(profile.monthlyIncome)} and monthly expenses are ${currencyAmount(profile.monthlyExpenses)}, leaving about ${currencyAmount(remaining)} before debt payments. Compare your actual spending with the budget you set, then decide how much of the remainder to move toward savings.`
      : /debt|loan/i.test(prompt)
        ? `Your profile lists ${currencyAmount(profile.debtBalance)} in debt. Keep required payments current, compare interest rates before choosing a payoff order, and avoid using emergency savings without considering upcoming essentials.`
        : `Your current savings are ${currencyAmount(profile.currentSavings)} and your monthly savings goal is ${currencyAmount(profile.savingsGoal)}. I can help you reason about budgets, saving, or debt using the profile details you provided. This is educational guidance, not a guarantee or individualized investment recommendation.`;
    json(response, 200, {
      id: randomBytes(8).toString('hex'),
      category: 'Personal finance guidance',
      advice,
      actionItems: ['Review the amounts in your profile for accuracy', 'Keep an emergency reserve for essential costs'],
      source: 'FINERVA RULE-BASED ADVISOR',
      modelUsed: 'Finerva local financial assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    return;
  }

  if (url.pathname.startsWith('/api/admin/')) {
    adminRequired(request);
    if (request.method === 'GET' && url.pathname === '/api/admin/overview') {
      const enabledCount = store.users.filter((user) => user.enabled).length;
      json(response, 200, {
        userCount: store.users.length,
        enabledCount,
        disabledCount: store.users.length - enabledCount,
        users: store.users.map((user) => ({
          id: user.id,
          name: user.name,
          email: `${user.email.slice(0, 2)}***@${user.email.split('@')[1]}`,
          enabled: user.enabled,
          createdAt: user.createdAt
        }))
      });
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/admin/settings') {
      json(response, 200, { ...store.settings });
      return;
    }
    if (request.method === 'PATCH' && url.pathname === '/api/admin/settings') {
      if (typeof body.maintenanceMode !== 'undefined' && typeof body.maintenanceMode !== 'boolean') {
        throw Object.assign(new Error('maintenanceMode must be true or false.'), { status: 400 });
      }
      if (typeof body.aiAssistantEnabled !== 'undefined' && typeof body.aiAssistantEnabled !== 'boolean') {
        throw Object.assign(new Error('aiAssistantEnabled must be true or false.'), { status: 400 });
      }
      store.settings = {
        ...store.settings,
        ...(typeof body.maintenanceMode === 'boolean' ? { maintenanceMode: body.maintenanceMode } : {}),
        ...(typeof body.aiAssistantEnabled === 'boolean' ? { aiAssistantEnabled: body.aiAssistantEnabled } : {})
      };
      await persistStore();
      json(response, 200, { ...store.settings });
      return;
    }
    const userMatch = url.pathname.match(/^\/api\/admin\/users\/([a-f0-9]+)$/);
    if (request.method === 'DELETE' && userMatch) {
      const userIndex = store.users.findIndex((candidate) => candidate.id === userMatch[1]);
      if (userIndex < 0) throw Object.assign(new Error('User account was not found.'), { status: 404 });
      const [removedUser] = store.users.splice(userIndex, 1);
      for (const [sessionToken, session] of sessions) {
        if (session.userId === removedUser.id) sessions.delete(sessionToken);
      }
      await persistStore();
      json(response, 200, { status: 'User account deleted.' });
      return;
    }
    if (request.method === 'PATCH' && userMatch) {
      if (typeof body.enabled !== 'boolean') {
        throw Object.assign(new Error('enabled must be true or false.'), { status: 400 });
      }
      const user = store.users.find((candidate) => candidate.id === userMatch[1]);
      if (!user) throw Object.assign(new Error('User account was not found.'), { status: 404 });
      user.enabled = body.enabled;
      await persistStore();
      json(response, 200, { id: user.id, enabled: user.enabled });
      return;
    }
  }

  json(response, 404, { error: 'API route not found.' });
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin || 'http://localhost:5000');
    response.setHeader('Vary', 'Origin');
  } else {
    json(response, 403, { error: 'Origin is not allowed.' });
    return;
  }
  try {
    await handle(request, response);
  } catch (error) {
    if (!response.headersSent) json(response, error.status || 500, { error: error.status ? error.message : 'The Finerva API encountered an unexpected error.' });
    if (!error.status) console.error('Finerva API request failed:', error);
  }
});

store = await readStore();
adminPassword = await passwordRecord(configuredAdminPassword);
server.listen(port, '0.0.0.0', () => {
  console.log(`Finerva API listening on http://localhost:${port}/api`);
  if (!process.env.FINERVA_ADMIN_PASSWORD) {
    console.warn('Using the local-demo admin password. Set FINERVA_ADMIN_PASSWORD before exposing this server.');
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
