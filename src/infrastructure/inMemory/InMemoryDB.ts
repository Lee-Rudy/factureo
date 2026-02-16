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

    // 5 Clients de test
    const client1: Client = {
      id: 'client-1',
      userId: 'user-1',
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@entreprise.fr',
      phone: '+33 6 12 34 56 78',
      adress: '15 Rue de Paris, 75001 Paris',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    };
    this.clients.set(client1.id, client1);

    const client2: Client = {
      id: 'client-2',
      userId: 'user-1',
      prenom: 'Marie',
      nom: 'Martin',
      email: 'marie.martin@agence.fr',
      phone: '+33 6 98 76 54 32',
      adress: '42 Avenue de Lyon, 69000 Lyon',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    };
    this.clients.set(client2.id, client2);

    const client3: Client = {
      id: 'client-3',
      userId: 'user-1',
      prenom: 'Pierre',
      nom: 'Bernard',
      email: 'p.bernard@techcorp.com',
      phone: '+33 7 45 67 89 01',
      adress: '8 Boulevard des Champs, 33000 Bordeaux',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    };
    this.clients.set(client3.id, client3);

    const client4: Client = {
      id: 'client-4',
      userId: 'user-1',
      prenom: 'Sophie',
      nom: 'Dubois',
      email: 'sophie.dubois@solutions.fr',
      phone: '+33 6 23 45 67 89',
      adress: '33 Rue du Commerce, 44000 Nantes',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    };
    this.clients.set(client4.id, client4);

    const client5: Client = {
      id: 'client-5',
      userId: 'user-1',
      prenom: 'Thomas',
      nom: 'Petit',
      email: 'thomas.petit@startup.io',
      phone: '+33 7 89 01 23 45',
      adress: '127 Avenue de la République, 13000 Marseille',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
    };
    this.clients.set(client5.id, client5);

    // Factures de test
    const facture1: Facture = {
      id: 'facture-1',
      userId: 'user-1',
      clientId: 'client-1',
      numero: 'FAC-2024-001',
      dateEmission: new Date('2024-02-01'),
      dateEcheance: new Date('2024-03-01'),
      status: FactureStatus.PAID,
      status_paiement: 'PAID',
      date_payee: new Date('2024-02-25'),
      frais_retard: 0,
      lines: [
        {
          id: 'line-1',
          description: 'Développement site web',
          quantite: 1,
          unitaire: 5000,
          montant_HT: 5000,
          taux_TVA: 20,
          montant_TVA: 1000,
          montant_TTC: 6000,
        },
      ],
      montantHT: 5000,
      montantTVA: 1000,
      montantTTC: 6000,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-25'),
    };
    this.factures.set(facture1.id, facture1);

    const facture2: Facture = {
      id: 'facture-2',
      userId: 'user-1',
      clientId: 'client-2',
      numero: 'FAC-2024-002',
      dateEmission: new Date('2024-02-10'),
      dateEcheance: new Date('2024-03-10'),
      status: FactureStatus.SENT,
      status_paiement: 'PENDING',
      date_payee: null,
      frais_retard: 0,
      lines: [
        {
          id: 'line-2',
          description: 'Consultation SEO',
          quantite: 5,
          unitaire: 150,
          montant_HT: 750,
          taux_TVA: 20,
          montant_TVA: 150,
          montant_TTC: 900,
        },
      ],
      montantHT: 750,
      montantTVA: 150,
      montantTTC: 900,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    };
    this.factures.set(facture2.id, facture2);
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
