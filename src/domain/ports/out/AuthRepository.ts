/**
 * Port AuthRepository - Interface pour l'authentification
 */

import { User } from '../../entities/User';

export interface AuthRepository {
  /**
   * Authentifie un utilisateur avec email et mot de passe
   */
  login(email: string, password: string): Promise<User>;

  /**
   * Enregistre un nouvel utilisateur
   */
  register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;

  /**
   * Récupère l'utilisateur courant
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Déconnecte l'utilisateur
   */
  logout(): Promise<void>;

  /**
   * Vérifie si un email existe déjà
   */
  emailExists(email: string): Promise<boolean>;
}
