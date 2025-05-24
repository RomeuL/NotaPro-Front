"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api, { authService } from '@/lib/api';
import Cookies from 'js-cookie';

interface User {
  id: string | number;
  email: string;
  nome: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clearAuthData = () => {
    Cookies.remove('auth-token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('auth-token');
      
      if (token) {
        try {
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    
    try {
      clearAuthData();
      
      const response = await authService.login(email, senha);
      
      if (response.token) {
        Cookies.set('auth-token', response.token, { 
          expires: 2,
          path: '/',
          sameSite: 'strict'
        });
        
        localStorage.setItem('token', response.token);
        
        const userData: User = {
          id: response.id,
          email: response.email,
          nome: response.nome,
          role: response.role
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        Cookies.set('user', JSON.stringify(userData), { 
          expires: 2,
          path: '/',
          sameSite: 'strict'
        });
        
        setUser(userData);
        
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    
    window.location.href = '/signin';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}