/**
 * Entité Client - Client de l'utilisateur
 */

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  siret?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ClientEntity implements Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  siret?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Client) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.siret = data.siret;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  update(updates: Partial<Client>): ClientEntity {
    return new ClientEntity({
      ...this,
      ...updates,
      updatedAt: new Date(),
    });
  }
}
