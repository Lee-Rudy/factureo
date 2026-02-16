/**
 * ClientUseCases - Cas d'utilisation : Gestion des clients (CRUD)
 */

import { ClientRepository } from '../../../domain/ports/out/ClientRepository';
import { Client } from '../../../domain/entities/Client';

export interface CreateClientDTO {
  userId: string;
  prenom: string;
  nom: string;
  email: string;
  phone: string;
  adress: string;
}

export interface UpdateClientDTO {
  prenom?: string;
  nom?: string;
  email?: string;
  phone?: string;
  adress?: string;
}

export class ClientUseCases {
  constructor(private clientRepository: ClientRepository) {}

  /**
   * LOGIQUE MÉTIER : Récupération liste clients
   */
  async list(userId: string): Promise<Client[]> {
    return await this.clientRepository.findByUserId(userId);
  }

  /**
   * LOGIQUE MÉTIER : Recherche clients par nom/prénom
   * Insensible à la casse
   */
  async search(userId: string, query: string): Promise<Client[]> {
    const allClients = await this.clientRepository.findByUserId(userId);
    const searchLower = query.toLowerCase().trim();

    if (!searchLower) return allClients;

    return allClients.filter(
      (client) =>
        client.prenom.toLowerCase().includes(searchLower) ||
        client.nom.toLowerCase().includes(searchLower) ||
        `${client.prenom} ${client.nom}`.toLowerCase().includes(searchLower)
    );
  }

  /**
   * LOGIQUE MÉTIER : Récupération détail client
   */
  async getById(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error('Client introuvable');
    }
    return client;
  }

  /**
   * LOGIQUE MÉTIER : Création client
   * - Validation email dans le repository
   * - Vérification nom et prénom non vides
   */
  async create(data: CreateClientDTO): Promise<Client> {
    if (!data.prenom.trim()) {
      throw new Error('Le prénom du client est obligatoire');
    }

    if (!data.nom.trim()) {
      throw new Error('Le nom du client est obligatoire');
    }

    if (!data.phone.trim()) {
      throw new Error('Le téléphone est obligatoire');
    }

    if (!data.adress.trim()) {
      throw new Error('L\'adresse est obligatoire');
    }

    return await this.clientRepository.create(data);
  }

  /**
   * LOGIQUE MÉTIER : Modification client
   * - Validation données si modifiées
   */
  async update(id: string, data: UpdateClientDTO): Promise<Client> {
    if (data.prenom !== undefined && !data.prenom.trim()) {
      throw new Error('Le prénom ne peut pas être vide');
    }

    if (data.nom !== undefined && !data.nom.trim()) {
      throw new Error('Le nom ne peut pas être vide');
    }

    return await this.clientRepository.update(id, data);
  }

  /**
   * LOGIQUE MÉTIER : Suppression client
   * - Vérification pas de factures associées (dans repository)
   * - Confirmation requise (gérée dans l'UI)
   */
  async delete(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
