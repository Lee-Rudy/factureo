/**
 * Value Object Password - Validation du mot de passe
 * Logique métier : Vérification de la force du mot de passe
 */

export class Password {
  private readonly value: string;

  constructor(password: string) {
    this.validate(password);
    this.value = password;
  }

  /**
   * LOGIQUE MÉTIER : Validation de la force du mot de passe
   * - Minimum 8 caractères
   * - Au moins une lettre majuscule
   * - Au moins une lettre minuscule
   * - Au moins un chiffre
   * - Au moins un caractère spécial (@$!%*?&)
   */
  private validate(password: string): void {
    if (!password) {
      throw new Error('Le mot de passe ne peut pas être vide');
    }

    if (password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!/[a-z]/.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins une minuscule');
    }

    if (!/[0-9]/.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins un chiffre');
    }

    if (!/[@$!%*?&#]/.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&#)');
    }
  }

  getValue(): string {
    return this.value;
  }

  /**
   * LOGIQUE MÉTIER : Hash du mot de passe (simulation)
   * En production, utiliser bcrypt ou argon2
   */
  async hash(): Promise<string> {
    // Simulation d'un hash (en production, utiliser bcrypt)
    return `hashed_${this.value}`;
  }

  /**
   * LOGIQUE MÉTIER : Vérification du mot de passe hashé
   * un stub de cryptographie ou (fake implementation) : hashed_${this.value}
   */
  static async verify(plain: string, hashed: string): Promise<boolean> {
    // Simulation (en production, utiliser bcrypt.compare)
    return `hashed_${plain}` === hashed;
  }
}
