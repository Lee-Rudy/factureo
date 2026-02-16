/**
 * Tests unitaires - DocumentCommercial (classe abstraite)
 */

import { DocumentCommercial, LigneDocumentCommercial } from '../DocumentCommercial';
import { Facture, FactureEntity, FactureStatus } from '../Facture';

describe('DocumentCommercial', () => {
  const mockFactureData: Facture = {
    id: 'test-1',
    userId: 'user-1',
    clientId: 'client-1',
    numero: 'FAC-TEST-001',
    dateEmission: new Date(),
    dateEcheance: new Date(),
    status: FactureStatus.DRAFT,
    status_paiement: 'PENDING',
    date_payee: null,
    frais_retard: 0,
    lines: [],
    montantHT: 0,
    montantTVA: 0,
    montantTTC: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Calcul totaux', () => {
    it('devrait calculer correctement les totaux avec plusieurs lignes', () => {
      const facture = new FactureEntity({
        ...mockFactureData,
        lines: [
          {
            id: 'line-1',
            description: 'Ligne 1',
            quantite: 2,
            unitaire: 100,
            montant_HT: 200,
            taux_TVA: 20,
            montant_TVA: 40,
            montant_TTC: 240,
          },
          {
            id: 'line-2',
            description: 'Ligne 2',
            quantite: 1,
            unitaire: 50,
            montant_HT: 50,
            taux_TVA: 20,
            montant_TVA: 10,
            montant_TTC: 60,
          },
        ],
      });

      facture.calculer_totaux();
      expect(facture.montant_HT).toBe(250);
      expect(facture.montant_TVA).toBe(50);
      expect(facture.montant_TTC).toBe(300);
    });

    it('devrait avoir des totaux à 0 sans lignes', () => {
      const facture = new FactureEntity(mockFactureData);
      facture.calculer_totaux();
      expect(facture.montant_HT).toBe(0);
      expect(facture.montant_TVA).toBe(0);
      expect(facture.montant_TTC).toBe(0);
    });
  });

  describe('Gestion des lignes', () => {
    it('devrait ajouter une ligne et recalculer les totaux', () => {
      const facture = new FactureEntity(mockFactureData);

      const nouvelleLigne: LigneDocumentCommercial = {
        id: 'line-new',
        description: 'Nouvelle ligne',
        quantite: 3,
        unitaire: 200,
        montant_HT: 600,
        taux_TVA: 20,
        montant_TVA: 120,
        montant_TTC: 720,
      };

      facture.ajouter_ligne(nouvelleLigne);

      expect(facture.lines.length).toBe(1);
      expect(facture.montant_HT).toBe(600);
      expect(facture.montant_TTC).toBe(720);
    });

    it('devrait supprimer une ligne et recalculer les totaux', () => {
      const facture = new FactureEntity({
        ...mockFactureData,
        lines: [
          {
            id: 'line-1',
            description: 'Ligne 1',
            quantite: 1,
            unitaire: 100,
            montant_HT: 100,
            taux_TVA: 20,
            montant_TVA: 20,
            montant_TTC: 120,
          },
          {
            id: 'line-2',
            description: 'Ligne 2',
            quantite: 1,
            unitaire: 50,
            montant_HT: 50,
            taux_TVA: 20,
            montant_TVA: 10,
            montant_TTC: 60,
          },
        ],
      });

      facture.supprimer_ligne('line-1');

      expect(facture.lines.length).toBe(1);
      expect(facture.montant_HT).toBe(50);
      expect(facture.montant_TTC).toBe(60);
    });
  });
});
