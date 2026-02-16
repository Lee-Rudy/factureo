/**
 * Tests unitaires - LoginUseCase
 */

import { LoginUseCase } from '../LoginUseCase';
import { AuthRepositoryMemory } from '../../../../infrastructure/inMemory/AuthRepositoryMemory';
import { db } from '../../../../infrastructure/inMemory/InMemoryDB';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let authRepository: AuthRepositoryMemory;

  beforeEach(() => {
    db.reset();
    authRepository = new AuthRepositoryMemory();
    loginUseCase = new LoginUseCase(authRepository);
  });

  it('devrait connecter un utilisateur avec des identifiants valides', async () => {
    const user = await loginUseCase.execute('test@factureo.com', 'Test1234!');
    expect(user.email).toBe('test@factureo.com');
    expect(user.firstName).toBe('Heritsilavina');
  });

  it('devrait rejeter un email invalide', async () => {
    await expect(loginUseCase.execute('invalid-email', 'Test1234!')).rejects.toThrow(
      'Format d\'email invalide'
    );
  });

  it('devrait rejeter un email inexistant', async () => {
    await expect(loginUseCase.execute('notfound@test.com', 'Test1234!')).rejects.toThrow(
      'Email ou mot de passe incorrect'
    );
  });

  it('devrait rejeter un mot de passe incorrect', async () => {
    await expect(loginUseCase.execute('test@factureo.com', 'WrongPassword1!')).rejects.toThrow(
      'Email ou mot de passe incorrect'
    );
  });
});
