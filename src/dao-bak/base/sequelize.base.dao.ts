import { Model, ModelStatic, Op } from "sequelize";
import { BaseDAO } from "../interfaces/base.dao";

/**
 * Abstract base DAO implementation using Sequelize
 * Provides common CRUD operations for Sequelize models
 */
export abstract class SequelizeBaseDAO<
  T extends Model,
  CreateAttributes,
  UpdateAttributes = Partial<CreateAttributes>,
> implements BaseDAO<T, CreateAttributes, UpdateAttributes> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /**
   * Create a new entity
   */
  async create(data: CreateAttributes): Promise<T> {
    try {
      const entity = await this.model.create(data as any);
      return entity as T;
    } catch (error) {
      throw new Error(`Error creating entity: ${error}`);
    }
  }

  /**
   * Find an entity by its ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      const entity = await this.model.findByPk(id);
      return entity as T | null;
    } catch (error) {
      throw new Error(`Error finding entity by id ${id}: ${error}`);
    }
  }

  /**
   * Find all entities
   */
  async findAll(options: any = {}): Promise<T[]> {
    try {
      const entities = await this.model.findAll(options);
      return entities as T[];
    } catch (error) {
      throw new Error(`Error finding all entities: ${error}`);
    }
  }

  /**
   * Update an entity by ID
   */
  async update(id: string, data: UpdateAttributes): Promise<T | null> {
    try {
      const [updatedRowsCount] = await this.model.update(data as any, {
        where: { id } as any,
        returning: true,
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      // Fetch the updated entity
      const updatedEntity = await this.model.findByPk(id);
      return updatedEntity as T | null;
    } catch (error) {
      throw new Error(`Error updating entity with id ${id}: ${error}`);
    }
  }

  /**
   * Delete an entity by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      const deletedRowsCount = await this.model.destroy({
        where: { id } as any,
      });
      return deletedRowsCount > 0;
    } catch (error) {
      throw new Error(`Error deleting entity with id ${id}: ${error}`);
    }
  }

  /**
   * Find entities by specific criteria
   */
  async findBy(criteria: any): Promise<T[]> {
    try {
      const entities = await this.model.findAll({
        where: criteria,
      });
      return entities as T[];
    } catch (error) {
      throw new Error(`Error finding entities by criteria: ${error}`);
    }
  }

  /**
   * Find one entity by specific criteria
   */
  async findOneBy(criteria: any): Promise<T | null> {
    try {
      const entity = await this.model.findOne({
        where: criteria,
      });
      return entity as T | null;
    } catch (error) {
      throw new Error(`Error finding entity by criteria: ${error}`);
    }
  }

  /**
   * Count entities matching criteria
   */
  async count(criteria: any = {}): Promise<number> {
    try {
      const count = await this.model.count({
        where: criteria,
      });
      return count;
    } catch (error) {
      throw new Error(`Error counting entities: ${error}`);
    }
  }
}
