/**
 * InMemoryDB - Simulation d'une base de données avec HashMap
 * Utilise Map pour un accès O(1) et des opérations CRUD optimisées
 */

import { User } from '../../domain/entities/User';
import { Client } from '../../domain/entities/Client';
import { Facture, FactureStatus } from '../../domain/entities/Facture';

/**
 * HashMap pour stocker les données en mémoire
 * Clé = ID de l'entité, Valeur = Entité
 */
export class InMemoryDB {
  private users: Map<string, User> = new Map();
  private clients: Map<string, Client> = new Map();
  private factures: Map<string, Facture> = new Map();
  private currentUserId: string | null = null;

  constructor() {
    this.seedData();
  }

  /**
   * SEED DATA : Données fictives pour le développement
   */
  private seedData(): void {
    // Utilisateur de test
    const testUser: User = {
      id: 'user-1',
      email: 'test@factureo.com',
      password: 'hashed_Test1234!',
      firstName: 'Heritsilavina',
      lastName: 'RAZAFIARISON',
      phone: '+261 34 12 345 67',
      companyName: 'Moocies',
      address: 'Madagascar',
      bankName: 'BNP Paribas',
      iban: 'FR76 1234 5678 9012 3456 7890 123',
      swift: 'BNPAFRPPXXX',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };
    this.users.set(testUser.id, testUser);

    // Clients de test
    const client1: Client = {
      id: 'client-1',
      userId: 'user-1',
      name: 'Informatique SARL',
      email: 'contact@informatique.com',
      phone: '+33 6 12 34 56 78',
      address: 'Paris, France',
      siret: 'MCSPDT2',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    };
    this.clients.set(client1.id, client1);

    const client2: Client = {
      id: 'client-2',
      userId: 'user-1',
      name: 'Agence Immobilier',
      email: 'info@agence-immo.fr',
      phone: '+33 6 98 76 54 32',
      address: 'Lyon, France',
      siret: 'MCSPDT1',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    };
    this.clients.set(client2.id, client2);

    // Factures de test
    const facture1: Facture = {
      id: 'facture-1',
      userId: 'user-1',
      clientId: 'client-1',
      numero: 'FAC-2024-001',
      dateEmission: new Date('2024-02-01'),
      dateEcheance: new Date('2024-03-01'),
      status: FactureStatus.PAID,
      lines: [
        {
          id: 'line-1',
          description: 'Développement site web',
          quantity: 1,
          unitPrice: 5000,
          tva: 20,
        },
      ],
      montantHT: 5000,
      montantTVA: 1000,
      montantTTC: 6000,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-10'),
    };
    this.factures.set(facture1.id, facture1);
  }

  // Getters pour accéder aux HashMaps
  getUsers(): Map<string, User> {
    return this.users;
  }

  getClients(): Map<string, Client> {
    return this.clients;
  }

  getFactures(): Map<string, Facture> {
    return this.factures;
  }

  // Gestion de la session utilisateur
  setCurrentUser(userId: string | null): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  /**
   * Reset de la base de données (pour les tests)
   */
  reset(): void {
    this.users.clear();
    this.clients.clear();
    this.factures.clear();
    this.currentUserId = null;
    this.seedData();
  }
}

// Instance singleton de la DB
export const db = new InMemoryDB();
