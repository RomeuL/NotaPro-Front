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
      setIsLoading(true);
      const token = Cookies.get('auth-token');
      
      if (token) {
        try {
          let userData;
          const userCookie = Cookies.get('user');
          
          if (userCookie) {
            userData = JSON.parse(userCookie);
          } else {
            const localStorageUser = localStorage.getItem('user');
            if (localStorageUser) {
              userData = JSON.parse(localStorageUser);
              Cookies.set('user', localStorageUser, { 
                expires: 2,
                path: '/',
                sameSite: 'lax'
              });
            }
          }
          
          if (userData) {
            console.log('User authenticated:', userData);
            setUser(userData);
          } else {
            console.warn('Token found but no user data');
            clearAuthData();
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          clearAuthData();
        }
      } else {
        console.log('No auth token found');
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
          sameSite: 'lax'
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
          sameSite: 'lax'
        });
        
        setUser(userData);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      
      await authService.logout();
      
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = '/signin';
    }
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