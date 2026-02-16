/**
 * RegisterUseCase - Cas d'utilisation : Inscription utilisateur
 */

import { AuthRepository } from '../../../domain/ports/out/AuthRepository';
import { User } from '../../../domain/entities/User';

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  address: string;
  bankName?: string;
  iban?: string;
  swift?: string;
}

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  /**
   * LOGIQUE MÉTIER : Enregistrement
   * - Validation via Value Objects dans le repository
   * - Vérification unicité email
   * - Création compte avec hash mot de passe
   */
  async execute(data: RegisterDTO): Promise<User> {
    try {
      return await this.authRepository.register(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur lors de l\'inscription');
    }
  }
}
