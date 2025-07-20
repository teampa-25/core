import { InferCreationAttributes, Model } from "sequelize";

/**
 * @description: Base Interface for Data Access Object (DAO)
 * containing base CRUD methods
 */
export interface IDAO<T extends Model> {
  get(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  //Partial<T>: allows for updating only some fields of the entity.
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  create(data: InferCreationAttributes<T>): Promise<T>;
}
