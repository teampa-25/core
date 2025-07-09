/**
 * Base repository interface defining common CRUD operations
 */
export interface IBaseRepository<
  T,
  CreateAttributes,
  UpdateAttributes = Partial<CreateAttributes>,
> {
  /**
   * Create a new entity
   */
  create(data: CreateAttributes): Promise<T>;

  /**
   * Find an entity by its ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities
   */
  findAll(options?: any): Promise<T[]>;

  /**
   * Update an entity by ID
   */
  update(id: string, data: UpdateAttributes): Promise<T | null>;

  /**
   * Delete an entity by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Find entities by specific criteria
   */
  findBy(criteria: any): Promise<T[]>;

  /**
   * Find one entity by specific criteria
   */
  findOneBy(criteria: any): Promise<T | null>;

  /**
   * Count entities matching criteria
   */
  count(criteria?: any): Promise<number>;
}
