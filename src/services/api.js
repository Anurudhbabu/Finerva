const API_ROOT = '/api';

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_ROOT}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload;
}

export const api = {
  register: (profile) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(profile)
  }),
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  adminLogin: (credentials) => request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  me: (token) => request('/me', { token }),
  logout: (token) => request('/auth/logout', { method: 'POST', token }),
  chat: (prompt, token) => request('/chat', {
    method: 'POST',
    token,
    body: JSON.stringify({ prompt })
  }),
  getFinance: (token) => request('/finance', { token }),
  saveFinance: (token, finance) => request('/finance', {
    method: 'PUT',
    token,
    body: JSON.stringify(finance)
  }),
  adminOverview: (token) => request('/admin/overview', { token }),
  adminSettings: (token) => request('/admin/settings', { token }),
  updateAdminSettings: (token, settings) => request('/admin/settings', {
    method: 'PATCH',
    token,
    body: JSON.stringify(settings)
  }),
  updateUserStatus: (token, userId, enabled) => request(`/admin/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ enabled })
  }),
  deleteUser: (token, userId) => request(`/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    token
  })
};
