/**
 * ClientUseCases - Cas d'utilisation : Gestion des clients (CRUD)
 */

import { ClientRepository } from '../../../domain/ports/out/ClientRepository';
import { Client } from '../../../domain/entities/Client';

export interface CreateClientDTO {
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  siret?: string;
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  siret?: string;
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
   * - Vérification nom non vide
   */
  async create(data: CreateClientDTO): Promise<Client> {
    if (!data.name.trim()) {
      throw new Error('Le nom du client est obligatoire');
    }

    if (!data.phone.trim()) {
      throw new Error('Le téléphone est obligatoire');
    }

    return await this.clientRepository.create(data);
  }

  /**
   * LOGIQUE MÉTIER : Modification client
   * - Validation données si modifiées
   */
  async update(id: string, data: UpdateClientDTO): Promise<Client> {
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('Le nom du client ne peut pas être vide');
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
