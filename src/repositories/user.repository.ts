import { User } from "@/models";
import { UserDAO } from "@/dao/user.dao";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";
import { InferCreationAttributes } from "sequelize";
import { log } from "console";
import { logger } from "@/config/logger";

/**
 * UserRepository is responsible for managing user data.
 * It provides methods to create, find, update, and delete users.
 */
export class UserRepository {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  /**
   * Creates a new user
   * @param email, password, role
   * @returns A Promise that resolves to the user or a string if not found
   */
  async createUser(
    user: InferCreationAttributes<User>,
  ): Promise<User | string> {
    return await this.userDAO.create(user);
  }

  /**
   * Finds a user by ID
   * @param id
   * @returns A Promise that resolves to the user or null if not found
   */
  async findById(id: string): Promise<User | null> {
    return await this.userDAO.get(id);
  }

  /**
   * Finds a user by email
   * @param email
   * @returns A Promise that resolves to the user or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userDAO.getByEmail(email);
  }

  /**
   * Updates the credits of a user
   * @param userId
   * @param newCreditAmount
   * @returns A Promise that resolves to the updated user or null if not found
   */
  async updateCredits(
    userId: string,
    newCreditAmount: number,
  ): Promise<User | null> {
    return await this.userDAO.update(userId, { credit: newCreditAmount });
  }

  /**
   * Checks if the user has enough credits
   * @param userId
   * @param requiredCredits
   * @returns A Promise that resolves to true if the user has enough credits, false otherwise
   */
  async hasEnoughCredits(
    userId: string,
    requiredCredits: number,
  ): Promise<boolean> {
    const user = await this.userDAO.get(userId);
    if (!user || user.credit === undefined) {
      return false;
    }
    return user.credit >= requiredCredits;
  }

  /**
   * Deducts credits from the user
   * @param userId
   * @param creditsToDeduct
   * @returns A Promise that resolves to the updated user or null if not found
   */
  async deductCredits(
    userId: string,
    creditsToDeduct: number,
  ): Promise<User | null> {
    const user = await this.userDAO.get(userId);
    if (!user || user.credit === undefined) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }

    if (user.credit < creditsToDeduct) {
      throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
    }

    const newCreditAmount = user.credit - creditsToDeduct;
    return await this.userDAO.update(userId, { credit: newCreditAmount });
  }

  /**
   * Delete User
   * @param email user email (which uniquely identifies a user)
   */
  async delete(email: string): Promise<void> {
    const user = await this.userDAO.getByEmail(email);
    // NOTE: why is id string | undefined? -beg
    if (user) await this.userDAO.delete(user.id!);
  }
}
