/**
 * Entité Facture - Facture émise
 */

export enum FactureStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface FactureLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tva: number;
}

export interface Facture {
  id: string;
  userId: string;
  clientId: string;
  numero: string;
  dateEmission: Date;
  dateEcheance: Date;
  status: FactureStatus;
  lines: FactureLine[];
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  createdAt: Date;
  updatedAt: Date;
}

export class FactureEntity implements Facture {
  id: string;
  userId: string;
  clientId: string;
  numero: string;
  dateEmission: Date;
  dateEcheance: Date;
  status: FactureStatus;
  lines: FactureLine[];
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Facture) {
    this.id = data.id;
    this.userId = data.userId;
    this.clientId = data.clientId;
    this.numero = data.numero;
    this.dateEmission = data.dateEmission;
    this.dateEcheance = data.dateEcheance;
    this.status = data.status;
    this.lines = data.lines;
    this.montantHT = data.montantHT;
    this.montantTVA = data.montantTVA;
    this.montantTTC = data.montantTTC;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Calcule le montant total HT de toutes les lignes
   */
  calculateMontantHT(): number {
    return this.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  }

  /**
   * Calcule le montant total de la TVA
   */
  calculateMontantTVA(): number {
    return this.lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice * (line.tva / 100),
      0
    );
  }

  /**
   * Calcule le montant total TTC
   */
  calculateMontantTTC(): number {
    return this.calculateMontantHT() + this.calculateMontantTVA();
  }

  /**
   * Marque la facture comme payée
   */
  markAsPaid(): FactureEntity {
    return new FactureEntity({
      ...this,
      status: FactureStatus.PAID,
      updatedAt: new Date(),
    });
  }

  /**
   * Vérifie si la facture est en retard
   */
  isOverdue(): boolean {
    return this.status !== FactureStatus.PAID && new Date() > this.dateEcheance;
  }
}
