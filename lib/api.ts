import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL ='https://notaproapi.romeu.dev.br/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('auth-token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authService = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },
  
  logout: async () => {
    Cookies.remove('auth-token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (typeof window !== 'undefined') {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return true;
  },
};