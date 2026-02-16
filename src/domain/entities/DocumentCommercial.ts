/**
 * Classe abstraite Document Commercial
 * Parent de Facture et Devis
 */

export interface LigneDocumentCommercial {
  id: string;
  description: string;
  quantite: number;
  unitaire: number;
  montant_HT: number;
  taux_TVA: number;
  montant_TVA: number;
  montant_TTC: number;
}

export abstract class DocumentCommercial {
  id: string;
  numero_document: string;
  date_emmision: Date;
  status_document: string;
  montant_HT: number;
  montant_TVA: number;
  montant_TTC: number;
  lines: LigneDocumentCommercial[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.numero_document = data.numero_document;
    this.date_emmision = data.date_emmision;
    this.status_document = data.status_document;
    this.montant_HT = data.montant_HT;
    this.montant_TVA = data.montant_TVA;
    this.montant_TTC = data.montant_TTC;
    this.lines = data.lines || [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * LOGIQUE MÉTIER : Calcul montant HT total
   */
  calculer_totaux(): void {
    this.montant_HT = this.lines.reduce((sum, line) => sum + line.montant_HT, 0);
    this.montant_TVA = this.lines.reduce((sum, line) => sum + line.montant_TVA, 0);
    this.montant_TTC = this.lines.reduce((sum, line) => sum + line.montant_TTC, 0);
  }

  /**
   * LOGIQUE MÉTIER : Ajout d'une ligne
   */
  ajouter_ligne(ligne: LigneDocumentCommercial): void {
    this.lines.push(ligne);
    this.calculer_totaux();
  }

  /**
   * LOGIQUE MÉTIER : Suppression d'une ligne
   */
  supprimer_ligne(ligneId: string): void {
    this.lines = this.lines.filter((l) => l.id !== ligneId);
    this.calculer_totaux();
  }

  abstract generer_pdf(): void;
}
