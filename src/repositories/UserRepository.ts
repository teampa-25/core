import { User } from "../database/models";
import {
  UserDAO,
  UserCreateAttributes,
  UserUpdateAttributes,
} from "../dao/UserDAO";
import { IUserRepository } from "./interfaces/IUserRepository";
import { Role } from "../utils/role";

/**
 * User repository implementation
 * Provides business logic layer over UserDAO
 */
export class UserRepository implements IUserRepository {
  constructor(private userDAO: UserDAO) {}

  async create(data: UserCreateAttributes): Promise<User> {
    return this.userDAO.create(data);
  }

  async findById(id: string): Promise<User | null> {
    return this.userDAO.findById(id);
  }

  async findAll(options?: any): Promise<User[]> {
    return this.userDAO.findAll(options);
  }

  async update(id: string, data: UserUpdateAttributes): Promise<User | null> {
    return this.userDAO.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.userDAO.delete(id);
  }

  async findBy(criteria: any): Promise<User[]> {
    return this.userDAO.findBy(criteria);
  }

  async findOneBy(criteria: any): Promise<User | null> {
    return this.userDAO.findOneBy(criteria);
  }

  async count(criteria?: any): Promise<number> {
    return this.userDAO.count(criteria);
  }

  // User-specific methods
  async findByEmail(email: string): Promise<User | null> {
    return this.userDAO.findByEmail(email);
  }

  async findByRole(role: Role): Promise<User[]> {
    return this.userDAO.findByRole(role);
  }

  async updateTokens(id: string, tokens: number): Promise<User | null> {
    return this.userDAO.updateTokens(id, tokens);
  }

  async deductTokens(id: string, amount: number): Promise<User | null> {
    return this.userDAO.deductTokens(id, amount);
  }

  async addTokens(id: string, amount: number): Promise<User | null> {
    return this.userDAO.addTokens(id, amount);
  }

  async hasSufficientTokens(id: string, amount: number): Promise<boolean> {
    return this.userDAO.hasSufficientTokens(id, amount);
  }

  async findUsersWithLowTokens(threshold: number): Promise<User[]> {
    return this.userDAO.findUsersWithLowTokens(threshold);
  }
}
