import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao";
import { User } from "@/models";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";

/**
 * UserDAO class implements IDAO interface for User model
 * Provides methods to create, retrieve, update, and delete users
 */
export class UserDAO implements IDAO<User> {
  /**
   * Retrieves a user by its ID
   * @param id - The ID of the user to retrieve
   * @returns A Promise that resolves to the user
   * @throws Error if the retrieval operation fails
   */
  async get(id: string): Promise<User> {
    try {
      const user = await User.findByPk(id);
      if (!user) throw getError(ErrorEnum.NOT_FOUND_ERROR);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all users
   * @returns A Promise that resolves to an array of all users
   * @throws Error if the retrieval operation fails
   */
  async getAll(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a user by its ID
   * @param id - The ID of the user to update
   * @param data - The new data for the user
   * @returns A Promise that resolves to the updated user
   * @throws Error if the update operation fails
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const update_user = await this.get(id);
      return await update_user.update(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a user by its ID
   * @param id - The ID of the user to delete
   * @throws Error if the delete operation fails
   */
  async delete(id: string): Promise<void> {
    try {
      const delete_user = await this.get(id);
      await delete_user.destroy();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new user
   * @param data - The data for the new user
   * @returns A Promise that resolves to the created user
   * @throws Error if the creation operation fails
   */
  async create(data: InferCreationAttributes<User>): Promise<User> {
    try {
      return await User.create(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a user by email address
   * @param email - The email address to search for
   * @returns A Promise that resolves to the user
   * @throws Error if the retrieval operation fails
   */
  async getByEmail(email: string): Promise<User> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) throw getError(ErrorEnum.NOT_FOUND_ERROR);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
