import { ModelAttributes } from "sequelize";

export interface IDAO<T> {
  get(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  update(t: T, ...params: any): Promise<void>;
  delete(t: T): Promise<void>;
}

