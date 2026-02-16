/**
 * Port FactureRepository - Interface pour la gestion des factures
 */

import { Facture, FactureStatus } from '../../entities/Facture';

export interface FactureRepository {
  /**
   * Récupère toutes les factures d'un utilisateur
   */
  findByUserId(userId: string): Promise<Facture[]>;

  /**
   * Récupère les factures d'un client spécifique
   */
  findByClientId(clientId: string): Promise<Facture[]>;

  /**
   * Récupère une facture par son ID
   */
  findById(id: string): Promise<Facture | null>;

  /**
   * Crée une nouvelle facture
   */
  create(factureData: Omit<Facture, 'id' | 'createdAt' | 'updatedAt'>): Promise<Facture>;

  /**
   * Met à jour une facture existante
   */
  update(id: string, updates: Partial<Facture>): Promise<Facture>;

  /**
   * Supprime une facture
   */
  delete(id: string): Promise<void>;

  /**
   * Change le statut d'une facture
   */
  updateStatus(id: string, status: FactureStatus): Promise<Facture>;

  /**
   * Génère le prochain numéro de facture
   */
  generateNextNumero(userId: string): Promise<string>;
}
