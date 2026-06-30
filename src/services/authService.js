import { api } from './apiClient';

export const logoutUser = ()                => api.post('/auth/logout');
export const checkAuthStatus = ()           => api.get('/auth/status');
export const authenticateGitHub = (body)    => api.post('/auth/github', body);
