import { IDAO } from "./idao"
import { UserModel } from "@/models/user";



export class UserDAO implements IDAO<UserModel> {

  async get(id: string): Promise<UserModel | null> {
    return await UserModel.findByPk(id);
  }

  async getAll(): Promise<UserModel[]> {
    return await UserModel.findAll();
  }

  async update(m: UserModel, ...params: any): Promise<void> {
    // await m.update(params);
    throw Error(" method not implemented");
  }

  async delete(m: UserModel): Promise<void> {
    // await m.update(params);
    throw Error(" method not implemented");
  }

  async getByEmail(email: string): Promise<UserModel | null> {
    return null
  }
}

