import { Tag } from "../../database/models";
import { TagCreateAttributes, TagUpdateAttributes } from "../../dao/TagDAO";
import { IBaseRepository } from "./IBaseRepository";

/**
 * Tag repository interface defining Tag-specific operations
 */
export interface ITagRepository
  extends IBaseRepository<Tag, TagCreateAttributes, TagUpdateAttributes> {
  /**
   * Find tag by name
   */
  findByName(name: string): Promise<Tag | null>;

  /**
   * Find tags by partial name match
   */
  findByPartialName(partialName: string): Promise<Tag[]>;

  /**
   * Find most used tags
   */
  findMostUsedTags(limit?: number): Promise<Tag[]>;

  /**
   * Find tags used by user
   */
  findTagsUsedByUser(userId: string): Promise<Tag[]>;

  /**
   * Check if tag name exists
   */
  nameExists(name: string, excludeId?: string): Promise<boolean>;

  /**
   * Find or create tag by name
   */
  findOrCreate(name: string): Promise<Tag>;

  /**
   * Search tags by keyword
   */
  searchByKeyword(keyword: string): Promise<Tag[]>;

  /**
   * Get tags statistics
   */
  getTagsStatistics(): Promise<{
    totalTags: number;
    mostUsedTag: Tag | null;
    averageUsage: number;
  }>;

  /**
   * Bulk create tags
   */
  bulkCreate(tagNames: string[]): Promise<Tag[]>;

  /**
   * Delete unused tags
   */
  deleteUnusedTags(): Promise<number>;
}
