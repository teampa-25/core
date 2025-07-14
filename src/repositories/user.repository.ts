import { InferCreationAttributes } from "sequelize";
import { User } from "@/models/user";
import { UserDAO } from "@/dao/user.dao";

export class UserRepository {
  private userDAO = new UserDAO();

  createUser(user: InferCreationAttributes<User>): Promise<User | null> {
    return this.userDAO.create(user);
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.userDAO.getByEmail(email);
  }
}
