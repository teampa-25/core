import { User } from "@/models";
import { UserDAO } from "@/dao/user.dao";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";
import { InferCreationAttributes } from "sequelize";

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
   * @returns A Promise that resolves the user
   */
  async createUser(user: InferCreationAttributes<User>): Promise<User> {
    return await this.userDAO.create(user);
  }

  /**
   * Finds a user by ID
   * @param id
   * @returns A Promise that resolves to the user
   */
  async findById(id: string): Promise<User> {
    return await this.userDAO.get(id);
  }

  /**
   * Finds a user by email
   * @param email
   * @returns A Promise that resolves to the user
   */
  async findByEmail(email: string): Promise<User> {
    return await this.userDAO.getByEmail(email);
  }

  /**
   * Updates the credits of a user
   * @param userId
   * @param newCreditAmount
   * @returns A Promise that resolves to the updated user
   */
  async updateCredits(userId: string, newCreditAmount: number): Promise<User> {
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
    return user.credit >= requiredCredits;
  }

  /**
   * Deducts credits from the user
   * @param userId
   * @param creditsToDeduct
   * @returns A Promise that resolves to the updated user
   */
  async deductCredits(userId: string, creditsToDeduct: number): Promise<User> {
    const user = await this.userDAO.get(userId);

    if (user.credit < creditsToDeduct) {
      throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
    }

    const newCreditAmount = user.credit - creditsToDeduct;
    return await this.userDAO.update(userId, { credit: newCreditAmount });
  }
}
