/**
 * Dependency Injection Container
 * Assemble les repositories et use cases
 */

import { AuthRepositoryMemory } from '../../infrastructure/inMemory/AuthRepositoryMemory';
import { ClientRepositoryMemory } from '../../infrastructure/inMemory/ClientRepositoryMemory';
import { FactureRepositoryMemory } from '../../infrastructure/inMemory/FactureRepositoryMemory';

import { LoginUseCase } from '../../application/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '../../application/usecases/auth/RegisterUseCase';
import { ClientUseCases } from '../../application/usecases/client/ClientUseCases';
import { FactureUseCases } from '../../application/usecases/facture/FactureUseCases';

// Repositories
const authRepository = new AuthRepositoryMemory();
const clientRepository = new ClientRepositoryMemory();
const factureRepository = new FactureRepositoryMemory();

// Use Cases
export const loginUseCase = new LoginUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const clientUseCases = new ClientUseCases(clientRepository);
export const factureUseCases = new FactureUseCases(factureRepository, clientRepository);

// Export repositories pour les queries
export { authRepository, clientRepository, factureRepository };
