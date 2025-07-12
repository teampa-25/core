/**
 * Base DAO interface that defines common CRUD operations
 * All specific DAOs must implement this interface
 */
export interface BaseDAO<
  T,
  CreateAttributes,
  UpdateAttributes = Partial<CreateAttributes>,
> {
  /**
   * Create a new entity
   * @param data - The data to create the entity with
   * @returns Promise of the created entity
   */
  create(data: CreateAttributes): Promise<T>;

  /**
   * Find an entity by its ID
   * @param id - The ID of the entity
   * @returns Promise of the entity or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities
   * @param options - Optional query options (limit, offset, where, etc.)
   * @returns Promise of array of entities
   */
  findAll(options?: any): Promise<T[]>;

  /**
   * Update an entity by ID
   * @param id - The ID of the entity to update
   * @param data - The data to update
   * @returns Promise of the updated entity or null if not found
   */
  update(id: string, data: UpdateAttributes): Promise<T | null>;

  /**
   * Delete an entity by ID
   * @param id - The ID of the entity to delete
   * @returns Promise of boolean indicating success
   */
  delete(id: string): Promise<boolean>;

  /**
   * Find entities by specific criteria
   * @param criteria - The search criteria
   * @returns Promise of array of entities
   */
  findBy(criteria: any): Promise<T[]>;

  /**
   * Find one entity by specific criteria
   * @param criteria - The search criteria
   * @returns Promise of the entity or null if not found
   */
  findOneBy(criteria: any): Promise<T | null>;

  /**
   * Count entities matching criteria
   * @param criteria - The search criteria
   * @returns Promise of count
   */
  count(criteria?: any): Promise<number>;
}
