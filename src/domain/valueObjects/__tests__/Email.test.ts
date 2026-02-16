/**
 * Tests unitaires - Email Value Object
 */

import { Email } from '../Email';

describe('Email Value Object', () => {
  describe('Validation', () => {
    it('devrait accepter un email valide', () => {
      const email = new Email('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('devrait normaliser l\'email en minuscules', () => {
      const email = new Email('TEST@EXAMPLE.COM');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('devrait supprimer les espaces', () => {
      const email = new Email('  test@example.com  ');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('devrait rejeter un email vide', () => {
      expect(() => new Email('')).toThrow('L\'email ne peut pas être vide');
    });

    it('devrait rejeter un email sans @', () => {
      expect(() => new Email('testexample.com')).toThrow('Format d\'email invalide');
    });

    it('devrait rejeter un email sans domaine', () => {
      expect(() => new Email('test@')).toThrow('Format d\'email invalide');
    });

    it('devrait rejeter un email trop long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(() => new Email(longEmail)).toThrow('L\'email est trop long');
    });
  });

  describe('Comparaison', () => {
    it('devrait retourner true pour deux emails identiques', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('devrait retourner false pour deux emails différents', () => {
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
