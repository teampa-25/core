import { InferCreationAttributes } from "sequelize";
import { JwtUtils } from "@/utils/jwt";
import { hashPass, comparePass } from "@/utils/encryption";
import { User } from "@/models/user";
import { UserRole } from "@/models/enums/user.role";
import { UserRepository } from "@/repositories/user.repository";

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
  async login(email: string, password: string): Promise<string | null> {
    const foundUser = await this.userRepo.findByEmail(email);

    if (
      !foundUser ||
      !foundUser.password ||
      !(await comparePass(password, foundUser.password))
    ) {
      return null;
    }

    return JwtUtils.generateToken({
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    });
  }

  async getCreditsByUserId(id: string): Promise<number | null> {
    const foundUser = await this.userRepo.findById(id);

    if (!foundUser || !foundUser.credit) {
      return null;
    }

    return foundUser.credit;
  }

  async addCreditsByUserEmail(
    email: string,
    credits: number,
  ): Promise<number | null> {
    const foundUser = await this.userRepo.findByEmail(email);

    if (!foundUser || !foundUser.id || !foundUser.credit) {
      return null;
    }

    const updatedUser = await this.userRepo.updateCredits(
      foundUser.id,
      foundUser.credit + credits,
    );

    return updatedUser?.credit!;
  }
}
