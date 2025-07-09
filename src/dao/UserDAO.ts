import { User } from "../database/models";
import { Role } from "./../utils/role";
import { Op, InferAttributes, InferCreationAttributes } from "sequelize";
import { SequelizeBaseDAO } from "./base/SequelizeBaseDAO";

// helpers for better type safety and consistency
export type UserCreateAttributes = InferCreationAttributes<User>;
export type UserUpdateAttributes = Partial<InferAttributes<User>>;

/**
 * User DAO class for database operations
 */
export class UserDAO extends SequelizeBaseDAO<
  User,
  UserCreateAttributes,
  UserUpdateAttributes
> {
  constructor() {
    super(User);
  }

  /**
   * Find a user by email
   * @param email - The email to search for
   * @returns Promise of the user or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.findOneBy({ email });
    } catch (error) {
      throw new Error(`Error finding user by email ${email}: ${error}`);
    }
  }

  /**
   * Find users by role
   * @param role - The role to search for
   * @returns Promise of array of users
   */
  async findByRole(role: Role): Promise<User[]> {
    try {
      return await this.findBy({ role });
    } catch (error) {
      throw new Error(`Error finding users by role ${role}: ${error}`);
    }
  }

  /**
   * Update user tokens
   * @param id - User ID
   * @param tokens - New token amount
   * @returns Promise of the updated user or null if not found
   */
  async updateTokens(id: string, tokens: number): Promise<User | null> {
    try {
      return await this.update(id, { tokens });
    } catch (error) {
      throw new Error(`Error updating tokens for user ${id}: ${error}`);
    }
  }

  /**
   * Deduct tokens from user
   * @param id - User ID
   * @param amount - Amount to deduct
   * @returns Promise of the updated user or null if insufficient tokens or user not found
   */
  async deductTokens(id: string, amount: number): Promise<User | null> {
    try {
      const user = await this.findById(id);
      if (!user) {
        return null;
      }

      if (user.tokens < amount) {
        throw new Error("Insufficient tokens");
      }

      const newTokens = user.tokens - amount;
      return await this.updateTokens(id, newTokens);
    } catch (error) {
      throw new Error(`Error deducting tokens for user ${id}: ${error}`);
    }
  }

  /**
   * Add tokens to user
   * @param id - User ID
   * @param amount - Amount to add
   * @returns Promise of the updated user or null if user not found
   */
  async addTokens(id: string, amount: number): Promise<User | null> {
    try {
      const user = await this.findById(id);
      if (!user) {
        return null;
      }

      const newTokens = user.tokens + amount;
      return await this.updateTokens(id, newTokens);
    } catch (error) {
      throw new Error(`Error adding tokens for user ${id}: ${error}`);
    }
  }

  /**
   * Check if user has sufficient tokens
   * @param id - User ID
   * @param amount - Amount to check
   * @returns Promise of boolean indicating if user has sufficient tokens
   */
  async hasSufficientTokens(id: string, amount: number): Promise<boolean> {
    try {
      const user = await this.findById(id);
      return user ? user.tokens >= amount : false;
    } catch (error) {
      throw new Error(`Error checking tokens for user ${id}: ${error}`);
    }
  }

  /**
   * Find users with tokens below a threshold
   * @param threshold - The token threshold
   * @returns Promise of array of users
   */
  async findUsersWithLowTokens(threshold: number): Promise<User[]> {
    try {
      return (await this.model.findAll({
        where: {
          tokens: {
            [Op.lt]: threshold,
          },
        },
      })) as User[];
    } catch (error) {
      throw new Error(`Error finding users with low tokens: ${error}`);
    }
  }
}
