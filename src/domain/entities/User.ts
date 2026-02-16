/**
 * Entité User - Utilisateur de l'application
 */

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  address: string;
  bankName?: string;
  iban?: string;
  swift?: string;
  createdAt: Date;
  updatedAt: Date;
}


export class UserEntity implements User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  address: string;
  bankName?: string;
  iban?: string;
  swift?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: User) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.companyName = data.companyName;
    this.address = data.address;
    this.bankName = data.bankName;
    this.iban = data.iban;
    this.swift = data.swift;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  updateProfile(updates: Partial<User>): UserEntity {
    return new UserEntity({
      ...this,
      ...updates,
      updatedAt: new Date(),
    });
  }
}
