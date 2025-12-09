import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : `${window.location.origin}/api`);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Adiciona um interceptador para incluir o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const path = (config.url || '').toString();
    const method = (config.method || 'get').toLowerCase();
    // Precisely mark only truly public endpoints
    const publicPrefixes = ['/stats', '/links', '/content'];
    const isTeamPublic = path === '/team' && method === 'get';
    const isPartnersPublic = path === '/partners' && method === 'get';
    const isNewsPublic = path.startsWith('/news') && method === 'get';
    const isPublic = isTeamPublic || isPartnersPublic || isNewsPublic || publicPrefixes.some((p) => path.startsWith(p));
    if (token && !isPublic) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add session ID for view tracking
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    config.headers['x-session-id'] = sessionId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de resposta para capturar token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpa token e dados do usuário
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user_id');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      // Redireciona para a página de login (rota existente)
      const loginPath = '/admin/login?expired=1';
      if (window.location.pathname !== '/admin/login') {
        window.location.replace(loginPath);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export const apiPublic = axios.create({
  baseURL: BASE_URL,
});
