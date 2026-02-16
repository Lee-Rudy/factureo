/**
 * Port ClientRepository - Interface pour la gestion des clients
 */

import { Client } from '../../entities/Client';

export interface ClientRepository {
  /**
   * Récupère tous les clients d'un utilisateur
   */
  findByUserId(userId: string): Promise<Client[]>;

  /**
   * Récupère un client par son ID
   */
  findById(id: string): Promise<Client | null>;

  /**
   * Crée un nouveau client
   */
  create(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client>;

  /**
   * Met à jour un client existant
   */
  update(id: string, updates: Partial<Client>): Promise<Client>;

  /**
   * Supprime un client
   */
  delete(id: string): Promise<void>;

  /**
   * Vérifie si un client a des factures associées
   */
  hasFactures(clientId: string): Promise<boolean>;
}
