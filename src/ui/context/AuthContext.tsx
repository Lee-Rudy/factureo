/**
 * AuthContext - Context API pour l'authentification
 * Utilise les Use Cases de la couche application
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '../../domain/entities/User';
import { loginUseCase, registerUseCase, authRepository } from '../app/container';
import { RegisterDTO } from '../../application/usecases/auth/RegisterUseCase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Récupère l'utilisateur courant au chargement
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authRepository.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  /**
   * LOGIQUE MÉTIER : Connexion via LoginUseCase
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await loginUseCase.execute(email, password);
      setUser(loggedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * LOGIQUE MÉTIER : Inscription via RegisterUseCase
   */
  const register = useCallback(async (data: RegisterDTO) => {
    setIsLoading(true);
    try {
      const newUser = await registerUseCase.execute(data);
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * LOGIQUE MÉTIER : Déconnexion
   */
  const logout = useCallback(async () => {
    await authRepository.logout();
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
