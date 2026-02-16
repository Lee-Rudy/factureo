/**
 * Value Object Email - Validation de l'email
 * Logique métier : Vérification du format email valide
 */

export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email.toLowerCase().trim();
  }

  /**
   * LOGIQUE MÉTIER : Validation du format email
   * - Doit contenir un @
   * - Doit avoir un domaine valide
   * - Format standard RFC 5322 simplifié
   */
  private validate(email: string): void {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      throw new Error('L\'email ne peut pas être vide');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Format d\'email invalide');
    }

    if (trimmedEmail.length > 254) {
      throw new Error('L\'email est trop long (max 254 caractères)');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
