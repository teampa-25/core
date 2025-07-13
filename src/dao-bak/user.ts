import { UserModel } from "@/models/user";
import { UserRole } from "@/models/enums/user.role";
import { Op, InferAttributes, InferCreationAttributes } from "sequelize";
import { SequelizeBaseDAO } from "./base/sequelize.base.dao";

// helpers for better type safety and consistency
export type UserCreateAttributes = InferCreationAttributes<UserModel>;
export type UserUpdateAttributes = Partial<InferAttributes<UserModel>>;

/**
 * User DAO class for database operations
 */
export class UserDAO extends SequelizeBaseDAO<
  UserModel,
  UserCreateAttributes,
  UserUpdateAttributes
> {
  constructor() {
    super(UserModel);
  }

  /**
   * Find a user by email
   * @param email - The email to search for
   * @returns Promise of the user or null if not found
   */
  async findByEmail(email: string): Promise<UserModel | null> {
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
  async findByRole(role: UserRole): Promise<UserModel[]> {
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
  async updateTokens(id: string, credit: number): Promise<UserModel | null> {
    try {
      return await this.update(id, { credit });
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
  async deductTokens(id: string, amount: number): Promise<UserModel | null> {
    try {
      const user = await this.findById(id);
      if (!user || !user.credit) {
        return null;
      }

      if (user.credit < amount) {
        throw new Error("Insufficient tokens");
      }

      const newTokens = user.credit - amount;
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
  async addTokens(id: string, amount: number): Promise<UserModel | null> {
    try {
      const user = await this.findById(id);
      if (!user || !user.credit) {
        return null;
      }

      const newTokens = user.credit + amount;
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

      if(!user || !user.credit){
        return false;
      }

      return user ? user.credit >= amount : false;
    } catch (error) {
      throw new Error(`Error checking tokens for user ${id}: ${error}`);
    }
  }

  /**
   * Find users with tokens below a threshold
   * @param threshold - The token threshold
   * @returns Promise of array of users
   */
  async findUsersWithLowTokens(threshold: number): Promise<UserModel[]> {
    try {
      return (await this.model.findAll({
        where: {
          credit: {
            [Op.lt]: threshold,
          },
        },
      })) as UserModel[];
    } catch (error) {
      throw new Error(`Error finding users with low tokens: ${error}`);
    }
  }
}
