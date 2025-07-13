import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao"
import { User } from "@/models/user";



export class UserDAO implements IDAO<User> {

  //await is not necessary here because the methods return promises
  async get(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async getAll(): Promise<User[]> {
    return User.findAll();
  }

  async update(id: string, data: Partial<User>): Promise< User | null> {
    const update_user = await this.get(id);

    if (!update_user) {
      return null;
    }

    return update_user.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const delete_user = await this.get(id);

    if (!delete_user) {
      return false;
    }
    await delete_user.destroy();
    return true;
  }

    //InferCreationAttributes is used to infer the attributes needed to create a new UserModel instance
  async create(data: InferCreationAttributes<User>): Promise<string> {
/*     const existing_user = await this.getByEmail(data.email);

    if (existing_user) {
      throw new Error("User with this email already exists");
    }
 */
    const new_user = await User.create(data);
    return new_user.id; 
  }

  async getByEmail(email: string): Promise<User | null> {
    return User.findOne({where: { email }});
  }
}
