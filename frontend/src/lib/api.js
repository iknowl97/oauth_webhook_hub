import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProviders = () => api.get('/api/providers').then(r => r.data);
export const createProvider = (data) => api.post('/api/providers', data).then(r => r.data);
export const deleteProvider = (id) => api.delete(`/api/providers/${id}`).then(r => r.data);

export const getWebhooks = () => api.get('/api/hooks').then(r => r.data);
export const createWebhook = (data) => api.post('/api/hooks', data).then(r => r.data);
export const deleteWebhook = (id) => api.delete(`/api/hooks/${id}`).then(r => r.data);
export const getWebhookRequests = (id) => api.get(`/api/hooks/${id}/requests`).then(r => r.data);

export const getTokens = () => api.get('/api/tokens').then(r => r.data);
export const deleteToken = (id) => api.delete(`/api/tokens/${id}`).then(r => r.data);
export const refreshToken = (id) => api.post(`/api/tokens/${id}/refresh`).then(r => r.data);
export const revokeToken = (id) => api.post(`/api/tokens/${id}/revoke`).then(r => r.data);
export const revealToken = (id) => api.get(`/api/tokens/${id}/reveal`).then(r => r.data);

export const getSubdomains = () => api.get('/api/subdomains').then(r => r.data);
export const createSubdomain = (data) => api.post('/api/subdomains', data).then(r => r.data);
export const deleteSubdomain = (id) => api.delete(`/api/subdomains/${id}`).then(r => r.data);

export default api;
