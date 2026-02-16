/**
 * Tests unitaires - Facture Entity
 * 
 * 
 * calculateMontantHT : calcule correctement le montant HT total
 * calculateMontantTVA :  calcule correctement le montant TVA total
 * calculateMontantTTC : calcule correctement le montant TTC total
 */

import { FactureEntity, FactureStatus, Facture } from '../Facture';

describe('FactureEntity', () => {
  const mockFacture: Facture = {
    id: 'facture-test',
    userId: 'user-1',
    clientId: 'client-1',
    numero: 'FAC-2024-001',
    dateEmission: new Date('2024-02-01'),
    dateEcheance: new Date('2024-03-01'),
    status: FactureStatus.DRAFT,
    status_paiement: 'PENDING',
    date_payee: null,
    frais_retard: 0,
    lines: [
      {
        id: 'line-1',
        description: 'Service 1',
        quantite: 2,
        unitaire: 500,
        montant_HT: 1000,
        taux_TVA: 20,
        montant_TVA: 200,
        montant_TTC: 1200,
      },
      {
        id: 'line-2',
        description: 'Service 2',
        quantite: 1,
        unitaire: 300,
        montant_HT: 300,
        taux_TVA: 20,
        montant_TVA: 60,
        montant_TTC: 360,
      },
    ],
    montantHT: 1300,
    montantTVA: 260,
    montantTTC: 1560,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Calculs montants', () => {
    it('devrait calculer correctement le montant HT', () => {
      const facture = new FactureEntity(mockFacture);
      expect(facture.calculateMontantHT()).toBe(1300);
    });

    it('devrait calculer correctement le montant TVA', () => {
      const facture = new FactureEntity(mockFacture);
      expect(facture.calculateMontantTVA()).toBe(260);
    });

    it('devrait calculer correctement le montant TTC', () => {
      const facture = new FactureEntity(mockFacture);
      expect(facture.calculateMontantTTC()).toBe(1560);
    });
  });

  describe('Marquer comme payée', () => {
    it('devrait marquer la facture comme payée avec date', () => {
      const facture = new FactureEntity(mockFacture);
      const datePaiement = new Date('2024-02-20');
      const paidFacture = facture.marquer_payee(datePaiement);

      expect(paidFacture.status).toBe(FactureStatus.PAID);
      expect(paidFacture.status_paiement).toBe('PAID');
      expect(paidFacture.date_payee).toEqual(datePaiement);
    });
  });

  describe('Vérification retard', () => {
    it('devrait détecter une facture en retard', () => {
      const pastDueFacture: Facture = {
        ...mockFacture,
        dateEcheance: new Date('2020-01-01'),
        status: FactureStatus.SENT,
      };
      const facture = new FactureEntity(pastDueFacture);
      expect(facture.est_retard()).toBe(true);
    });

    it('ne devrait pas considérer une facture payée en retard', () => {
      const paidFacture: Facture = {
        ...mockFacture,
        dateEcheance: new Date('2020-01-01'),
        status: FactureStatus.PAID,
      };
      const facture = new FactureEntity(paidFacture);
      expect(facture.est_retard()).toBe(false);
    });
  });

  describe('Annulation facture', () => {
    it('devrait annuler une facture non payée', () => {
      const facture = new FactureEntity(mockFacture);
      const cancelledFacture = facture.marquer_annulee();
      expect(cancelledFacture.status).toBe(FactureStatus.CANCELLED);
    });

    it('devrait rejeter l\'annulation d\'une facture payée', () => {
      const paidFacture: Facture = {
        ...mockFacture,
        status: FactureStatus.PAID,
      };
      const facture = new FactureEntity(paidFacture);
      expect(() => facture.marquer_annulee()).toThrow(
        'Impossible d\'annuler une facture déjà payée'
      );
    });
  });
});
