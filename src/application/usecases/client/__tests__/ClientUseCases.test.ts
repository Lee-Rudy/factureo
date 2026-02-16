/**
 * Tests unitaires - ClientUseCases
 */

import { ClientUseCases } from '../ClientUseCases';
import { ClientRepositoryMemory } from '../../../../infrastructure/inMemory/ClientRepositoryMemory';
import { db } from '../../../../infrastructure/inMemory/InMemoryDB';

describe('ClientUseCases', () => {
  let clientUseCases: ClientUseCases;
  let clientRepository: ClientRepositoryMemory;

  beforeEach(() => {
    db.reset();
    clientRepository = new ClientRepositoryMemory();
    clientUseCases = new ClientUseCases(clientRepository);
  });

  describe('Création client', () => {
    it('devrait créer un client avec des données valides', async () => {
      const newClient = await clientUseCases.create({
        userId: 'user-1',
        prenom: 'Test',
        nom: 'Client',
        email: 'client@test.com',
        phone: '+33 6 12 34 56 78',
        adress: 'Paris',
      });

      expect(newClient.prenom).toBe('Test');
      expect(newClient.nom).toBe('Client');
      expect(newClient.email).toBe('client@test.com');
    });

    it('devrait rejeter un client sans prénom', async () => {
      await expect(
        clientUseCases.create({
          userId: 'user-1',
          prenom: '',
          nom: 'Client',
          email: 'client@test.com',
          phone: '+33 6 12 34 56 78',
          adress: 'Paris',
        })
      ).rejects.toThrow('Le prénom du client est obligatoire');
    });

    it('devrait rejeter un email invalide', async () => {
      await expect(
        clientUseCases.create({
          userId: 'user-1',
          prenom: 'Test',
          nom: 'Client',
          email: 'invalid-email',
          phone: '+33 6 12 34 56 78',
          adress: 'Paris',
        })
      ).rejects.toThrow('Format d\'email invalide');
    });
  });

  describe('Liste clients', () => {
    it('devrait retourner la liste des clients d\'un utilisateur', async () => {
      const clients = await clientUseCases.list('user-1');
      expect(clients.length).toBe(5);
      expect(clients[0].prenom).toBe('Jean');
    });
  });

  describe('Recherche clients', () => {
    it('devrait trouver un client par prénom', async () => {
      const results = await clientUseCases.search('user-1', 'Jean');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].prenom).toBe('Jean');
    });

    it('devrait trouver un client par nom', async () => {
      const results = await clientUseCases.search('user-1', 'Dupont');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].nom).toBe('Dupont');
    });

    it('devrait retourner tous les clients si recherche vide', async () => {
      const results = await clientUseCases.search('user-1', '');
      expect(results.length).toBe(5);
    });
  });

  describe('Suppression client', () => {
    it('devrait empêcher la suppression d\'un client avec factures', async () => {
      await expect(clientUseCases.delete('client-1')).rejects.toThrow(
        'Impossible de supprimer un client avec des factures associées'
      );
    });

    it('devrait permettre la suppression d\'un client sans factures', async () => {
      await expect(clientUseCases.delete('client-2')).resolves.not.toThrow();
    });
  });
});
