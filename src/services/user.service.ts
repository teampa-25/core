import { InferCreationAttributes } from "sequelize";
import { JwtUtils } from "@/utils/jwt";
import { hashPass, comparePass } from "@/utils/encryption";
import { User } from "@/models/user";
import { UserRole } from "@/models/enums/user.role";
import { UserRepository } from "@/repositories/user.repository";

export class UserService {
  private userRepo = new UserRepository();

  async create(email: string, password: string): Promise<User | string> {
    const user: InferCreationAttributes<User> = {
      email: email,
      password: await hashPass(password),
      role: UserRole.USER,
    };

    return await this.userRepo.createUser(user);
  }

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
}
