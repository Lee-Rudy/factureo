/**
 * Entité Facture - Facture émise
 * Hérite de Document Commercial
 */

import { DocumentCommercial, LigneDocumentCommercial } from './DocumentCommercial';

export enum FactureStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface FactureLine extends LigneDocumentCommercial {}

export interface Facture {
  id: string;
  userId: string;
  clientId: string;
  numero: string;
  dateEmission: Date;
  dateEcheance: Date;
  status: FactureStatus;
  status_paiement: string;
  date_payee: Date | null;
  frais_retard: number;
  lines: FactureLine[];
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  createdAt: Date;
  updatedAt: Date;
}

export class FactureEntity extends DocumentCommercial implements Facture {
  userId: string;
  clientId: string;
  numero: string;
  dateEmission: Date;
  dateEcheance: Date;
  status: FactureStatus;
  status_paiement: string;
  date_payee: Date | null;
  frais_retard: number;

  constructor(data: Facture) {
    super({
      id: data.id,
      numero_document: data.numero,
      date_emmision: data.dateEmission,
      status_document: data.status,
      montant_HT: data.montantHT,
      montant_TVA: data.montantTVA,
      montant_TTC: data.montantTTC,
      lines: data.lines,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });

    this.userId = data.userId;
    this.clientId = data.clientId;
    this.numero = data.numero;
    this.dateEmission = data.dateEmission;
    this.dateEcheance = data.dateEcheance;
    this.status = data.status;
    this.status_paiement = data.status_paiement;
    this.date_payee = data.date_payee;
    this.frais_retard = data.frais_retard;
  }

  /**
   * LOGIQUE MÉTIER : Calcul montant HT
   */
  calculateMontantHT(): number {
    return this.lines.reduce((sum, line) => sum + line.montant_HT, 0);
  }

  /**
   * LOGIQUE MÉTIER : Calcul montant TVA
   */
  calculateMontantTVA(): number {
    return this.lines.reduce((sum, line) => sum + line.montant_TVA, 0);
  }

  /**
   * LOGIQUE MÉTIER : Calcul montant TTC
   */
  calculateMontantTTC(): number {
    return this.lines.reduce((sum, line) => sum + line.montant_TTC, 0);
  }

  /**
   * LOGIQUE MÉTIER : Marque la facture comme payée
   */
  marquer_payee(datePaiement: Date): FactureEntity {
    return new FactureEntity({
      ...this,
      status: FactureStatus.PAID,
      status_paiement: 'PAID',
      date_payee: datePaiement,
      updatedAt: new Date(),
    });
  }

  /**
   * LOGIQUE MÉTIER : Vérifie si la facture est en retard
   */
  est_retard(): boolean {
    return this.status !== FactureStatus.PAID && new Date() > this.dateEcheance;
  }

  /**
   * LOGIQUE MÉTIER : Annule la facture
   */
  marquer_annulee(): FactureEntity {
    if (this.status === FactureStatus.PAID) {
      throw new Error('Impossible d\'annuler une facture déjà payée');
    }
    return new FactureEntity({
      ...this,
      status: FactureStatus.CANCELLED,
      updatedAt: new Date(),
    });
  }

  generer_pdf(): void {
    // TODO: Implémenter génération PDF
    console.log('Génération PDF pour facture', this.numero);
  }
}
