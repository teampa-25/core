import { InferCreationAttributes } from "sequelize";
import { JwtUtils } from "@/common/utils/jwt";
import { hashPass, comparePass } from "@/common/utils/encryption";
import { User } from "@/models";
import { ErrorEnum, UserRole } from "@/common/enums";
import { UserRepository } from "@/repositories/user.repository";
import { getError } from "@/common/utils/api-error";

/**
 * UserService is responsible for managing user data.
 * It provides methods to create and authenticate users.
 */
export class UserService {
  private userRepo = new UserRepository();

  /**
   * Creates a new user
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns The created user or an error message
   */
  async create(email: string, password: string): Promise<User | string> {
    const user: InferCreationAttributes<User> = {
      email: email,
      password: await hashPass(password),
      role: UserRole.USER,
    };

    return await this.userRepo.createUser(user);
  }

  /**
   * Logs in a user
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns A JWT token if login is successful, null otherwise
   */
  async login(email: string, password: string): Promise<string> {
    const foundUser = await this.userRepo.findByEmail(email);

    if (
      !foundUser ||
      !foundUser.password ||
      !(await comparePass(password, foundUser.password))
    ) {
      throw getError(ErrorEnum.UNAUTHORIZED_ERROR);
    }

    return JwtUtils.generateToken({
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    });
  }

  /**
   * Retrieves the credits of a user by their ID.
   * @param id The ID of the user.
   * @returns The number of credits the user has, or null if not found.
   */
  async getCreditsByUserId(id: string): Promise<number> {
    const foundUser = await this.userRepo.findById(id);

    if (!foundUser || !foundUser.credit) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }

    return foundUser.credit;
  }

  /**
   * Adds credits to a user by their email.
   * @param email The email of the user.
   * @param credits The number of credits to add.
   * @returns The updated number of credits, or null if the user was not found.
   */
  async addCreditsByUserEmail(email: string, credits: number): Promise<number> {
    const foundUser = await this.userRepo.findByEmail(email);

    if (!foundUser || !foundUser.id || !foundUser.credit) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }

    const updatedUser = await this.userRepo.updateCredits(
      foundUser.id,
      foundUser.credit + credits,
    );

    return updatedUser?.credit!;
  }

  /**
   * Delete User
   * @param email The email of the user.
   * @returns The updated number of credits, or null if the user was not found.
   */
  async delete(email: string): Promise<void> {
    try {
      await this.userRepo.delete(email);
    } catch {
      throw getError(ErrorEnum.GENERIC_ERROR).toJSON();
    }
  }
}
