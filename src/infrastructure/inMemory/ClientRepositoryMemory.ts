/**
 * ClientRepositoryMemory - Implémentation InMemory du ClientRepository
 * Utilise HashMap pour les opérations CRUD sur les clients
 */

import { ClientRepository } from '../../domain/ports/out/ClientRepository';
import { Client } from '../../domain/entities/Client';
import { Email } from '../../domain/valueObjects/Email';
import { db } from './InMemoryDB';

export class ClientRepositoryMemory implements ClientRepository {
  /**
   * LOGIQUE MÉTIER : Récupération des clients par utilisateur
   * Utilise Array.from + filter pour recherche dans le HashMap
   */
  async findByUserId(userId: string): Promise<Client[]> {
    const clients = db.getClients();
    return Array.from(clients.values()).filter((c) => c.userId === userId);
  }

  async findById(id: string): Promise<Client | null> {
    return db.getClients().get(id) || null;
  }

  /**
   * LOGIQUE MÉTIER : Création d'un client
   * - Validation email
   * - Génération ID unique
   * - Ajout dans le HashMap
   */
  async create(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    // Validation email
    const emailVO = new Email(clientData.email);

    // Génération ID unique
    const id = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newClient: Client = {
      ...clientData,
      id,
      email: emailVO.getValue(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ajout dans le HashMap
    db.getClients().set(id, newClient);

    return newClient;
  }

  /**
   * LOGIQUE MÉTIER : Mise à jour d'un client
   * - Vérification existence
   * - Validation email si modifié
   * - Mise à jour du HashMap
   */
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const client = db.getClients().get(id);
    if (!client) {
      throw new Error('Client introuvable');
    }

    // Validation email si modifié
    if (updates.email) {
      const emailVO = new Email(updates.email);
      updates.email = emailVO.getValue();
    }

    const updatedClient: Client = {
      ...client,
      ...updates,
      updatedAt: new Date(),
    };

    // Mise à jour dans le HashMap
    db.getClients().set(id, updatedClient);

    return updatedClient;
  }

  /**
   * LOGIQUE MÉTIER : Suppression d'un client
   * - Vérification pas de factures associées
   * - Suppression du HashMap
   */
  async delete(id: string): Promise<void> {
    // Vérification factures associées
    const hasFactures = await this.hasFactures(id);
    if (hasFactures) {
      throw new Error('Impossible de supprimer un client avec des factures associées');
    }

    // Suppression du HashMap
    db.getClients().delete(id);
  }

  /**
   * LOGIQUE MÉTIER : Vérifie si le client a des factures
   * Recherche dans le HashMap des factures
   */
  async hasFactures(clientId: string): Promise<boolean> {
    const factures = db.getFactures();
    return Array.from(factures.values()).some((f) => f.clientId === clientId);
  }
}
