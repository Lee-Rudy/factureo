/**
 * FactureUseCases - Cas d'utilisation : Gestion des factures (CRUD)
 */

import { FactureRepository } from '../../../domain/ports/out/FactureRepository';
import { ClientRepository } from '../../../domain/ports/out/ClientRepository';
import { Facture, FactureStatus, FactureLine } from '../../../domain/entities/Facture';

export interface CreateFactureDTO {
  userId: string;
  clientId: string;
  dateEmission: Date;
  dateEcheance: Date;
  lines: FactureLine[];
}

export interface UpdateFactureDTO {
  clientId?: string;
  dateEmission?: Date;
  dateEcheance?: Date;
  lines?: FactureLine[];
  status?: FactureStatus;
}

export class FactureUseCases {
  constructor(
    private factureRepository: FactureRepository,
    private clientRepository: ClientRepository
  ) {}

  /**
   * LOGIQUE MÉTIER : Récupération liste factures
   */
  async list(userId: string): Promise<Facture[]> {
    return await this.factureRepository.findByUserId(userId);
  }

  /**
   * LOGIQUE MÉTIER : Récupération factures par client
   */
  async listByClient(clientId: string): Promise<Facture[]> {
    return await this.factureRepository.findByClientId(clientId);
  }

  /**
   * LOGIQUE MÉTIER : Récupération détail facture
   */
  async getById(id: string): Promise<Facture> {
    const facture = await this.factureRepository.findById(id);
    if (!facture) {
      throw new Error('Facture introuvable');
    }
    return facture;
  }

  /**
   * LOGIQUE MÉTIER : Création facture
   * - Vérification client existe
   * - Validation date échéance > date émission
   * - Validation au moins une ligne
   * - Calcul automatique des montants
   */
  async create(data: CreateFactureDTO): Promise<Facture> {
    // Vérification client existe
    const client = await this.clientRepository.findById(data.clientId);
    if (!client) {
      throw new Error('Client introuvable');
    }

    // Validation dates
    if (data.dateEcheance <= data.dateEmission) {
      throw new Error('La date d\'échéance doit être après la date d\'émission');
    }

    // Validation lignes
    if (!data.lines || data.lines.length === 0) {
      throw new Error('La facture doit contenir au moins une ligne');
    }

    // Validation montants lignes
    for (const line of data.lines) {
      if (line.quantity <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
      }
      if (line.unitPrice < 0) {
        throw new Error('Le prix unitaire ne peut pas être négatif');
      }
    }

    return await this.factureRepository.create({
      ...data,
      status: FactureStatus.DRAFT,
      montantHT: 0,
      montantTVA: 0,
      montantTTC: 0,
    });
  }

  /**
   * LOGIQUE MÉTIER : Modification facture
   * - Validation statut (pas de modification si payée)
   * - Recalcul automatique si lignes modifiées
   */
  async update(id: string, data: UpdateFactureDTO): Promise<Facture> {
    const facture = await this.getById(id);

    if (facture.status === FactureStatus.PAID && data.status !== FactureStatus.PAID) {
      throw new Error('Impossible de modifier une facture payée');
    }

    return await this.factureRepository.update(id, data);
  }

  /**
   * LOGIQUE MÉTIER : Suppression facture
   * - Interdit si payée (dans repository)
   * - Confirmation requise (gérée dans l'UI)
   */
  async delete(id: string): Promise<void> {
    await this.factureRepository.delete(id);
  }

  /**
   * LOGIQUE MÉTIER : Marquer comme payée
   */
  async markAsPaid(id: string): Promise<Facture> {
    return await this.factureRepository.updateStatus(id, FactureStatus.PAID);
  }

  /**
   * LOGIQUE MÉTIER : Marquer comme envoyée
   */
  async markAsSent(id: string): Promise<Facture> {
    return await this.factureRepository.updateStatus(id, FactureStatus.SENT);
  }
}
