/**
 * Tests unitaires - Password Value Object
 */

import { Password } from '../Password';

describe('Password Value Object', () => {
  describe('Validation Force du mot de passe', () => {
    it('devrait accepter un mot de passe fort valide', () => {
      const password = new Password('Test1234!');
      expect(password.getValue()).toBe('Test1234!');
    });

    it('devrait rejeter un mot de passe trop court', () => {
      expect(() => new Password('Test1!')).toThrow(
        'Le mot de passe doit contenir au moins 8 caractères'
      );
    });

    it('devrait rejeter un mot de passe sans majuscule', () => {
      expect(() => new Password('test1234!')).toThrow(
        'Le mot de passe doit contenir au moins une majuscule'
      );
    });

    it('devrait rejeter un mot de passe sans minuscule', () => {
      expect(() => new Password('TEST1234!')).toThrow(
        'Le mot de passe doit contenir au moins une minuscule'
      );
    });

    it('devrait rejeter un mot de passe sans chiffre', () => {
      expect(() => new Password('TestTest!')).toThrow(
        'Le mot de passe doit contenir au moins un chiffre'
      );
    });

    it('devrait rejeter un mot de passe sans caractère spécial', () => {
      expect(() => new Password('Test1234')).toThrow(
        'Le mot de passe doit contenir au moins un caractère spécial'
      );
    });

    it('devrait rejeter un mot de passe vide', () => {
      expect(() => new Password('')).toThrow('Le mot de passe ne peut pas être vide');
    });
  });

  describe('Hash et vérification', () => {
    it('devrait hasher le mot de passe', async () => {
      const password = new Password('Test1234!');
      const hashed = await password.hash();
      expect(hashed).toBe('hashed_Test1234!');
    });

    it('devrait vérifier un mot de passe correct', async () => {
      const plain = 'Test1234!';
      const hashed = 'hashed_Test1234!';
      const isValid = await Password.verify(plain, hashed);
      expect(isValid).toBe(true);
    });

    it('devrait rejeter un mot de passe incorrect', async () => {
      const plain = 'WrongPassword1!';
      const hashed = 'hashed_Test1234!';
      const isValid = await Password.verify(plain, hashed);
      expect(isValid).toBe(false);
    });
  });
});
