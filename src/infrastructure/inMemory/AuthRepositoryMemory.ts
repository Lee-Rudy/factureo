/**
 * AuthRepositoryMemory - Implémentation InMemory du AuthRepository
 * Utilise HashMap pour stocker et récupérer les utilisateurs
 */

import { AuthRepository } from '../../domain/ports/out/AuthRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/valueObjects/Email';
import { Password } from '../../domain/valueObjects/Password';
import { db } from './InMemoryDB';

export class AuthRepositoryMemory implements AuthRepository {
  /**
   * LOGIQUE MÉTIER : Authentification utilisateur
   * - Validation email et mot de passe
   * - Vérification existence utilisateur
   * - Comparaison mot de passe hashé
   */
  async login(email: string, password: string): Promise<User> {
    // Validation du format email
    const emailVO = new Email(email);
    const emailValue = emailVO.getValue();

    // Recherche utilisateur par email dans le HashMap
    const users = db.getUsers();
    const user = Array.from(users.values()).find((u) => u.email === emailValue);

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérification du mot de passe
    const isValid = await Password.verify(password, user.password);
    if (!isValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Enregistre la session
    db.setCurrentUser(user.id);

    return user;
  }

  /**
   * LOGIQUE MÉTIER : Enregistrement d'un nouvel utilisateur
   * - Validation email et mot de passe
   * - Vérification unicité email
   * - Hash du mot de passe
   * - Génération ID unique
   */
  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Validation email
    const emailVO = new Email(userData.email);
    const emailValue = emailVO.getValue();

    // Vérification unicité email
    if (await this.emailExists(emailValue)) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Validation et hash du mot de passe
    const passwordVO = new Password(userData.password);
    const hashedPassword = await passwordVO.hash();

    // Génération ID unique
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newUser: User = {
      ...userData,
      id,
      email: emailValue,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ajout dans le HashMap
    db.getUsers().set(id, newUser);

    // Enregistre la session
    db.setCurrentUser(id);

    return newUser;
  }

  async getCurrentUser(): Promise<User | null> {
    const userId = db.getCurrentUserId();
    if (!userId) return null;

    return db.getUsers().get(userId) || null;
  }

  async logout(): Promise<void> {
    db.setCurrentUser(null);
  }

  /**
   * LOGIQUE MÉTIER : Vérification unicité email
   */
  async emailExists(email: string): Promise<boolean> {
    const users = db.getUsers();
    return Array.from(users.values()).some((u) => u.email === email.toLowerCase());
  }
}
