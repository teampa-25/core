import { User } from "../../database/models";
import { UserCreateAttributes, UserUpdateAttributes } from "../../dao/UserDAO";
import { IBaseRepository } from "./IBaseRepository";
import { Role } from "../../utils/role";

/**
 * User repository interface defining User-specific operations
 */
export interface IUserRepository
  extends IBaseRepository<User, UserCreateAttributes, UserUpdateAttributes> {
  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find users by role
   */
  findByRole(role: Role): Promise<User[]>;

  /**
   * Update user tokens
   */
  updateTokens(id: string, tokens: number): Promise<User | null>;

  /**
   * Deduct tokens from user
   */
  deductTokens(id: string, amount: number): Promise<User | null>;

  /**
   * Add tokens to user
   */
  addTokens(id: string, amount: number): Promise<User | null>;

  /**
   * Check if user has sufficient tokens
   */
  hasSufficientTokens(id: string, amount: number): Promise<boolean>;

  /**
   * Find users with tokens below a threshold
   */
  findUsersWithLowTokens(threshold: number): Promise<User[]>;
}
