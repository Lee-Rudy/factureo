/**
 * Tests unitaires - FactureUseCases
 */

import { FactureUseCases } from '../FactureUseCases';
import { FactureRepositoryMemory } from '../../../../infrastructure/inMemory/FactureRepositoryMemory';
import { ClientRepositoryMemory } from '../../../../infrastructure/inMemory/ClientRepositoryMemory';
import { db } from '../../../../infrastructure/inMemory/InMemoryDB';
import { FactureStatus } from '../../../../domain/entities/Facture';

describe('FactureUseCases', () => {
  let factureUseCases: FactureUseCases;
  let factureRepository: FactureRepositoryMemory;
  let clientRepository: ClientRepositoryMemory;

  beforeEach(() => {
    db.reset();
    factureRepository = new FactureRepositoryMemory();
    clientRepository = new ClientRepositoryMemory();
    factureUseCases = new FactureUseCases(factureRepository, clientRepository);
  });

  describe('Création facture', () => {
    it('devrait créer une facture avec des données valides', async () => {
      const newFacture = await factureUseCases.create({
        userId: 'user-1',
        clientId: 'client-1',
        dateEmission: new Date('2024-02-15'),
        dateEcheance: new Date('2024-03-15'),
        lines: [
          {
            id: 'line-1',
            description: 'Service de consultation',
            quantite: 2,
            unitaire: 500,
            montant_HT: 1000,
            taux_TVA: 20,
            montant_TVA: 200,
            montant_TTC: 1200,
          },
        ],
      });

      expect(newFacture.numero).toContain('FAC-2024');
      expect(newFacture.montantHT).toBe(1000);
      expect(newFacture.montantTTC).toBe(1200);
    });

    it('devrait rejeter une facture avec client inexistant', async () => {
      await expect(
        factureUseCases.create({
          userId: 'user-1',
          clientId: 'client-inexistant',
          dateEmission: new Date(),
          dateEcheance: new Date(),
          lines: [],
        })
      ).rejects.toThrow('Client introuvable');
    });

    it('devrait rejeter une facture avec date échéance avant émission', async () => {
      await expect(
        factureUseCases.create({
          userId: 'user-1',
          clientId: 'client-1',
          dateEmission: new Date('2024-03-15'),
          dateEcheance: new Date('2024-02-15'),
          lines: [
            {
              id: 'line-1',
              description: 'Test',
              quantite: 1,
              unitaire: 100,
              montant_HT: 100,
              taux_TVA: 20,
              montant_TVA: 20,
              montant_TTC: 120,
            },
          ],
        })
      ).rejects.toThrow('La date d\'échéance doit être après la date d\'émission');
    });

    it('devrait rejeter une facture sans lignes', async () => {
      await expect(
        factureUseCases.create({
          userId: 'user-1',
          clientId: 'client-1',
          dateEmission: new Date(),
          dateEcheance: new Date(Date.now() + 86400000),
          lines: [],
        })
      ).rejects.toThrow('La facture doit contenir au moins une ligne');
    });

    it('devrait rejeter une ligne avec quantité négative', async () => {
      await expect(
        factureUseCases.create({
          userId: 'user-1',
          clientId: 'client-1',
          dateEmission: new Date(),
          dateEcheance: new Date(Date.now() + 86400000),
          lines: [
            {
              id: 'line-1',
              description: 'Test',
              quantite: -1,
              unitaire: 100,
              montant_HT: -100,
              taux_TVA: 20,
              montant_TVA: -20,
              montant_TTC: -120,
            },
          ],
        })
      ).rejects.toThrow('La quantité doit être supérieure à 0');
    });
  });

  describe('Liste factures', () => {
    it('devrait retourner la liste des factures d\'un utilisateur', async () => {
      const factures = await factureUseCases.list('user-1');
      expect(factures.length).toBeGreaterThan(0);
    });
  });

  describe('Marquer comme payée', () => {
    it('devrait marquer une facture comme payée', async () => {
      const factures = await factureUseCases.list('user-1');
      const draftFacture = factures.find((f) => f.status !== FactureStatus.PAID);

      if (draftFacture) {
        const updated = await factureUseCases.markAsPaid(draftFacture.id);
        expect(updated.status).toBe(FactureStatus.PAID);
      }
    });
  });

  describe('Suppression facture', () => {
    it('devrait empêcher la suppression d\'une facture payée', async () => {
      await expect(factureUseCases.delete('facture-1')).rejects.toThrow(
        'Impossible de supprimer une facture payée'
      );
    });
  });
});
