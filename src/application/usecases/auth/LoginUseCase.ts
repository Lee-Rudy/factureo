/**
 * LoginUseCase - Cas d'utilisation : Connexion utilisateur
 */

import { AuthRepository } from '../../../domain/ports/out/AuthRepository';
import { User } from '../../../domain/entities/User';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  /**
   * LOGIQUE MÉTIER : Authentification
   * - Délègue la validation au repository
   * - Gère les erreurs métier
   */
  async execute(email: string, password: string): Promise<User> {
    try {
      return await this.authRepository.login(email, password);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur lors de la connexion');
    }
  }
}
