/**
 * FactureRepositoryMemory - Implémentation InMemory du FactureRepository
 * Utilise HashMap pour les opérations CRUD sur les factures
 */

import { FactureRepository } from '../../domain/ports/out/FactureRepository';
import { Facture, FactureStatus, FactureEntity } from '../../domain/entities/Facture';
import { db } from './InMemoryDB';

export class FactureRepositoryMemory implements FactureRepository {
  async findByUserId(userId: string): Promise<Facture[]> {
    const factures = db.getFactures();
    return Array.from(factures.values()).filter((f) => f.userId === userId);
  }

  async findByClientId(clientId: string): Promise<Facture[]> {
    const factures = db.getFactures();
    return Array.from(factures.values()).filter((f) => f.clientId === clientId);
  }

  async findById(id: string): Promise<Facture | null> {
    return db.getFactures().get(id) || null;
  }

  /**
   * LOGIQUE MÉTIER : Création d'une facture
   * - Validation client existe
   * - Calcul automatique des montants HT, TVA, TTC
   * - Génération numéro automatique
   */
  async create(factureData: Omit<Facture, 'id' | 'createdAt' | 'updatedAt'>): Promise<Facture> {
    // Vérification client existe
    const client = db.getClients().get(factureData.clientId);
    if (!client) {
      throw new Error('Client introuvable');
    }

    // Génération ID et numéro
    const id = `facture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const numero = await this.generateNextNumero(factureData.userId);

    const factureEntity = new FactureEntity({
      ...factureData,
      id,
      numero,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Recalcul des montants
    const newFacture: Facture = {
      ...factureData,
      id,
      numero,
      montantHT: factureEntity.calculateMontantHT(),
      montantTVA: factureEntity.calculateMontantTVA(),
      montantTTC: factureEntity.calculateMontantTTC(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.getFactures().set(id, newFacture);

    return newFacture;
  }

  /**
   * LOGIQUE MÉTIER : Mise à jour d'une facture
   * - Recalcul automatique si lignes modifiées
   * - Validation statut
   */
  async update(id: string, updates: Partial<Facture>): Promise<Facture> {
    const facture = db.getFactures().get(id);
    if (!facture) {
      throw new Error('Facture introuvable');
    }

    // Interdit modification si payée
    if (facture.status === FactureStatus.PAID && updates.status !== FactureStatus.PAID) {
      throw new Error('Impossible de modifier une facture déjà payée');
    }

    const updatedData = {
      ...facture,
      ...updates,
      updatedAt: new Date(),
    };

    // Recalcul si lignes modifiées
    if (updates.lines) {
      const entity = new FactureEntity(updatedData);
      updatedData.montantHT = entity.calculateMontantHT();
      updatedData.montantTVA = entity.calculateMontantTVA();
      updatedData.montantTTC = entity.calculateMontantTTC();
    }

    db.getFactures().set(id, updatedData);

    return updatedData;
  }

  /**
   * LOGIQUE MÉTIER : Suppression d'une facture
   * - Interdit suppression si payée
   */
  async delete(id: string): Promise<void> {
    const facture = db.getFactures().get(id);
    if (!facture) {
      throw new Error('Facture introuvable');
    }

    if (facture.status === FactureStatus.PAID) {
      throw new Error('Impossible de supprimer une facture payée');
    }

    db.getFactures().delete(id);
  }

  async updateStatus(id: string, status: FactureStatus): Promise<Facture> {
    return this.update(id, { status });
  }

  /**
   * LOGIQUE MÉTIER : Génération automatique du numéro de facture
   * Format : FAC-YYYY-XXX (XXX = compteur incrémental)
   */
  async generateNextNumero(userId: string): Promise<string> {
    const year = new Date().getFullYear();
    const userFactures = await this.findByUserId(userId);
    
    // Compte les factures de l'année en cours
    const currentYearFactures = userFactures.filter(
      (f) => f.dateEmission.getFullYear() === year
    );

    const nextNumber = currentYearFactures.length + 1;
    const paddedNumber = nextNumber.toString().padStart(3, '0');

    return `FAC-${year}-${paddedNumber}`;
  }
}
