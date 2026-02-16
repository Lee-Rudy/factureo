/**
 * Entité Client - Client de l'utilisateur
 */

export interface Client {
  id: string;
  userId: string;
  prenom: string;
  nom: string;
  email: string;
  phone: string;
  adress: string;
  createdAt: Date;
  updatedAt: Date;
}


export class ClientEntity implements Client {
  id: string;
  userId: string;
  prenom: string;
  nom: string;
  email: string;
  phone: string;
  adress: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Client) {
    this.id = data.id;
    this.userId = data.userId;
    this.prenom = data.prenom;
    this.nom = data.nom;
    this.email = data.email;
    this.phone = data.phone;
    this.adress = data.adress;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get fullName(): string {
    return `${this.prenom} ${this.nom}`;
  }

  update(updates: Partial<Client>): ClientEntity {
    return new ClientEntity({
      ...this,
      ...updates,
      updatedAt: new Date(),
    });
  }
}
