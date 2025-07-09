import { Tag } from "../database/models";
import { SequelizeBaseDAO } from "./base/SequelizeBaseDAO";
import { Op, InferAttributes, InferCreationAttributes } from "sequelize";

// helpers for better type safety and consistency
export type TagCreateAttributes = InferCreationAttributes<Tag>;
export type TagUpdateAttributes = Partial<InferAttributes<Tag>>;

/**
 * Tag DAO class for database operations
 * Extends the base DAO with Tag-specific methods
 */
export class TagDAO extends SequelizeBaseDAO<
  Tag,
  TagCreateAttributes,
  TagUpdateAttributes
> {
  constructor() {
    super(Tag);
  }

  /**
   * Find tag by name
   * @param name - The tag name to search for
   * @returns Promise of the tag or null if not found
   */
  async findByName(name: string): Promise<Tag | null> {
    try {
      return await this.findOneBy({ name });
    } catch (error) {
      throw new Error(`Error finding tag by name ${name}: ${error}`);
    }
  }

  /**
   * Find tags by partial name match
   * @param partialName - Partial name to search for
   * @returns Promise of array of tags
   */
  async findByPartialName(partialName: string): Promise<Tag[]> {
    try {
      return (await this.model.findAll({
        where: {
          name: {
            [Op.iLike]: `%${partialName}%`,
          },
        },
        order: [["name", "ASC"]],
      })) as Tag[];
    } catch (error) {
      throw new Error(
        `Error finding tags by partial name ${partialName}: ${error}`,
      );
    }
  }

  /**
   * Find tags that start with prefix
   * @param prefix - Prefix to search for
   * @returns Promise of array of tags
   */
  async findByPrefix(prefix: string): Promise<Tag[]> {
    try {
      return (await this.model.findAll({
        where: {
          name: {
            [Op.iLike]: `${prefix}%`,
          },
        },
        order: [["name", "ASC"]],
      })) as Tag[];
    } catch (error) {
      throw new Error(`Error finding tags by prefix ${prefix}: ${error}`);
    }
  }

  /**
   * Check if tag name exists
   * @param name - The tag name
   * @param excludeId - Optional ID to exclude from check (for updates)
   * @returns Promise of boolean indicating if name exists
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    try {
      const whereClause: any = { name };

      if (excludeId) {
        whereClause.id = {
          [Op.ne]: excludeId,
        };
      }

      const count = await this.count(whereClause);
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking if tag name exists: ${error}`);
    }
  }

  /**
   * Get all tags ordered by name
   * @returns Promise of array of tags
   */
  async getAllOrdered(): Promise<Tag[]> {
    try {
      return (await this.model.findAll({
        order: [["name", "ASC"]],
      })) as Tag[];
    } catch (error) {
      throw new Error(`Error getting all tags ordered: ${error}`);
    }
  }

  /**
   * Get popular tags (this would need dataset relationship to be meaningful)
   * For now, returns all tags ordered by name
   * @param limit - Number of tags to return
   * @returns Promise of array of popular tags
   */
  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    try {
      return (await this.model.findAll({
        order: [["createdAt", "ASC"]], // Older tags are likely more established
        limit,
      })) as Tag[];
    } catch (error) {
      throw new Error(`Error getting popular tags: ${error}`);
    }
  }

  /**
   * Find or create tag by name
   * @param name - The tag name
   * @returns Promise of the tag (existing or newly created)
   */
  async findOrCreate(name: string): Promise<Tag> {
    try {
      const [tag] = await this.model.findOrCreate({
        where: { name },
        defaults: { name },
      });
      return tag as Tag;
    } catch (error) {
      throw new Error(`Error finding or creating tag ${name}: ${error}`);
    }
  }

  /**
   * Bulk find or create tags
   * @param names - Array of tag names
   * @returns Promise of array of tags
   */
  async bulkFindOrCreate(names: string[]): Promise<Tag[]> {
    try {
      const tags: Tag[] = [];

      for (const name of names) {
        const tag = await this.findOrCreate(name);
        tags.push(tag);
      }

      return tags;
    } catch (error) {
      throw new Error(`Error bulk finding or creating tags: ${error}`);
    }
  }

  /**
   * Get tags created within date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise of array of tags
   */
  async findTagsInDateRange(startDate: Date, endDate: Date): Promise<Tag[]> {
    try {
      return (await this.model.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["createdAt", "DESC"]],
      })) as Tag[];
    } catch (error) {
      throw new Error(`Error finding tags in date range: ${error}`);
    }
  }

  /**
   * Delete unused tags (this would need dataset relationship to be meaningful)
   * For now, just returns a placeholder
   * @returns Promise of number of deleted tags
   */
  async deleteUnusedTags(): Promise<number> {
    try {
      // This would require checking which tags are not used in any datasets
      // For now, return 0 as placeholder
      console.log(
        "Delete unused tags functionality would be implemented with dataset relationships",
      );
      return 0;
    } catch (error) {
      throw new Error(`Error deleting unused tags: ${error}`);
    }
  }

  /**
   * Search tags by multiple criteria
   * @param searchTerm - Search term for tag name
   * @param limit - Maximum number of results
   * @returns Promise of array of tags
   */
  async searchTags(searchTerm: string, limit: number = 20): Promise<Tag[]> {
    try {
      return (await this.model.findAll({
        where: {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        order: [
          // Exact matches first
          [
            this.model.sequelize!.literal(
              `CASE WHEN name = '${searchTerm}' THEN 0 ELSE 1 END`,
            ),
            "ASC",
          ],
          ["name", "ASC"],
        ],
        limit,
      })) as Tag[];
    } catch (error) {
      throw new Error(`Error searching tags: ${error}`);
    }
  }
}
