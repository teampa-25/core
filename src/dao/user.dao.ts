import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao";
import { User } from "@/models";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";

export class UserDAO implements IDAO<User> {
  //await is not necessary here because the methods return promises
  async get(id: string): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const update_user = await this.get(id);

      if (!update_user) {
        return null;
      }

      return await update_user.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const delete_user = await this.get(id);

      if (!delete_user) {
        return false;
      }

      await delete_user.destroy();
      return true;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  //InferCreationAttributes is used to infer the attributes needed to create a new UserModel instance
  async create(data: InferCreationAttributes<User>): Promise<User | string> {
    try {
      const new_user = await User.create(data);

      if (!new_user.id) {
        throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
      }

      return new_user;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }
}
