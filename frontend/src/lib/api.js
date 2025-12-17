import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000',
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

export default api;
