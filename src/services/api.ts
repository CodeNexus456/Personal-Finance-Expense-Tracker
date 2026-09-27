import axios from 'axios';
import { localBackend } from './localBackend';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fintrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fallback executor for Vercel static deployments and offline usage
function executeLocalFallback(config: any) {
  const url = (config.url || '').replace(/^\/api/, '');
  const method = (config.method || 'get').toLowerCase();
  const data = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
  const params = config.params || {};

  try {
    // 1. Auth routes
    if (url === '/auth/register' && method === 'post') {
      const res = localBackend.register(data);
      return { data: res, status: 201 };
    }
    if (url === '/auth/login' && method === 'post') {
      const res = localBackend.login(data);
      return { data: res, status: 200 };
    }
    if (url === '/auth/me' && method === 'get') {
      const res = localBackend.getMe();
      return { data: res, status: 200 };
    }

    // 2. Transactions routes
    if (url === '/transactions' && method === 'get') {
      const res = localBackend.getTransactions(params);
      return { data: res, status: 200 };
    }
    if (url === '/transactions' && method === 'post') {
      const res = localBackend.addTransaction(data);
      return { data: res, status: 201 };
    }
    const txIdMatch = url.match(/^\/transactions\/([a-zA-Z0-9_-]+)$/);
    if (txIdMatch) {
      const id = txIdMatch[1];
      if (method === 'put') {
        const res = localBackend.updateTransaction(id, data);
        return { data: res, status: 200 };
      }
      if (method === 'delete') {
        const res = localBackend.deleteTransaction(id);
        return { data: res, status: 200 };
      }
    }

    // 3. Budgets routes
    if (url === '/budgets' && method === 'get') {
      const res = localBackend.getBudgets(params?.month, params?.year);
      return { data: res, status: 200 };
    }
    if (url === '/budgets' && method === 'post') {
      const res = localBackend.setBudget(data);
      return { data: res, status: 200 };
    }
    const bgIdMatch = url.match(/^\/budgets\/([a-zA-Z0-9_-]+)$/);
    if (bgIdMatch) {
      const id = bgIdMatch[1];
      if (method === 'put') {
        const res = localBackend.updateBudget(id, data.amount);
        return { data: res, status: 200 };
      }
      if (method === 'delete') {
        const res = localBackend.deleteBudget(id);
        return { data: res, status: 200 };
      }
    }

    // 4. Dashboard stats route
    if (url === '/dashboard/stats' && method === 'get') {
      const res = localBackend.getDashboardStats();
      return { data: res, status: 200 };
    }
  } catch (err: any) {
    const errorObj: any = new Error(err.message || 'Operation failed');
    errorObj.response = {
      status: 400,
      data: { message: err.message || 'Operation failed' },
    };
    throw errorObj;
  }

  return null;
}

// Response interceptor to handle 404 (e.g. Vercel static hosting) or network failures
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;

    // If 404 (endpoint not found on server/Vercel) or Network Error (no server running)
    const isServerUnreachable = !error.response || status === 404 || status === 405 || status === 502 || status === 504;

    if (isServerUnreachable && config && !config._isRetry) {
      config._isRetry = true;
      const fallbackResult = executeLocalFallback(config);
      if (fallbackResult) {
        return Promise.resolve({
          data: fallbackResult.data,
          status: fallbackResult.status,
          statusText: 'OK',
          headers: {},
          config,
        });
      }
    }

    // Specific duplicate email error handling
    if (status === 400 && error.response?.data?.message) {
      return Promise.reject(error);
    }

    // 401 unauthorized
    if (status === 401) {
      const token = localStorage.getItem('fintrack_token');
      if (token && !token.startsWith('jwt_demo_') && !token.startsWith('jwt_local_')) {
        localStorage.removeItem('fintrack_token');
        localStorage.removeItem('fintrack_user');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
