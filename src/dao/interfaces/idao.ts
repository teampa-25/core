import { InferCreationAttributes, Model } from "sequelize";

export interface IDAO<T extends Model> {
  get(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;

  //Partial<T>: allows for updating only some fields of the entity. -cate
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  create(data: InferCreationAttributes<T>): Promise<T | null>;
}
