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
   * @returns A Promise that resolves to the user or null if not found
   * @throws Error if the retrieval operation fails
   */
  async get(id: string): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
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
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Updates a user by its ID
   * @param id - The ID of the user to update
   * @param data - The new data for the user
   * @returns A Promise that resolves to the updated user or null if not found
   * @throws Error if the update operation fails
   */
  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const update_user = await this.get(id);

      if (!update_user) {
        return null;
      }

      return await update_user.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Deletes a user by its ID
   * @param id - The ID of the user to delete
   * @returns A Promise that resolves to true if the user was deleted, false otherwise
   * @throws Error if the delete operation fails
   */
  async delete(id: string): Promise<boolean> {
    try {
      const delete_user = await this.get(id);

      if (!delete_user) {
        return false;
      }

      await delete_user.destroy();
      return true;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Creates a new user
   * @param data - The data for the new user
   * @returns A Promise that resolves to the created user or its ID
   * @throws Error if the creation operation fails
   */
  async create(data: InferCreationAttributes<User>): Promise<User | string> {
    try {
      const new_user = await User.create(data);

      if (!new_user.id) {
        throw getError(ErrorEnum.GENERIC_ERROR);
      }

      return new_user;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Retrieves a user by email address
   * @param email - The email address to search for
   * @returns A Promise that resolves to the user or null if not found
   * @throws Error if the retrieval operation fails
   */
  async getByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }
}
