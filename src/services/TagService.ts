import { Tag } from "../database/models/Tag";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { ITagRepository } from "../repositories/interfaces/ITagRepository";
import { logger } from "../config/logger";

/**
 * Tag Service
 * Business logic layer for tag operations
 */
export class TagService {
  private tagRepository: ITagRepository;

  constructor() {
    this.tagRepository = RepositoryFactory.createTagRepository();
  }

  /**
   * Create a new tag
   */
  async createTag(name: string): Promise<Tag> {
    try {
      logger.info(`Creating new tag: ${name}`);

      // Business logic validation
      if (!name || name.trim().length === 0) {
        throw new Error("Tag name is required");
      }

      // Normalize tag name (lowercase, trim whitespace)
      const normalizedName = name.toLowerCase().trim();

      if (normalizedName.length < 2) {
        throw new Error("Tag name must be at least 2 characters long");
      }

      if (normalizedName.length > 50) {
        throw new Error("Tag name cannot exceed 50 characters");
      }

      // Check if tag already exists
      const existingTag = await this.tagRepository.findByName(normalizedName);
      if (existingTag) {
        throw new Error(`Tag with name "${normalizedName}" already exists`);
      }

      // Create the tag
      const newTag = await this.tagRepository.create({
        name: normalizedName,
      } as any);

      logger.info(`Tag created successfully with ID: ${newTag.id}`);
      return newTag;
    } catch (error) {
      logger.error(`Error creating tag: ${error}`);
      throw error;
    }
  }

  /**
   * Get tag by ID
   */
  async getTagById(id: string): Promise<Tag | null> {
    try {
      logger.info(`Fetching tag with ID: ${id}`);

      if (!id || id.trim().length === 0) {
        throw new Error("Tag ID is required");
      }

      const tag = await this.tagRepository.findById(id);

      if (!tag) {
        logger.warn(`Tag with ID ${id} not found`);
        return null;
      }

      logger.info(`Tag found: ${tag.name}`);
      return tag;
    } catch (error) {
      logger.error(`Error fetching tag by ID: ${error}`);
      throw error;
    }
  }

  /**
   * Get tag by name
   */
  async getTagByName(name: string): Promise<Tag | null> {
    try {
      logger.info(`Fetching tag with name: ${name}`);

      if (!name || name.trim().length === 0) {
        throw new Error("Tag name is required");
      }

      const normalizedName = name.toLowerCase().trim();
      const tag = await this.tagRepository.findByName(normalizedName);

      if (!tag) {
        logger.warn(`Tag with name ${normalizedName} not found`);
        return null;
      }

      logger.info(`Tag found: ${tag.id}`);
      return tag;
    } catch (error) {
      logger.error(`Error fetching tag by name: ${error}`);
      throw error;
    }
  }

  /**
   * Get all tags
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      logger.info("Fetching all tags");

      const tags = await this.tagRepository.findAll();

      logger.info(`Found ${tags.length} tags`);
      return tags;
    } catch (error) {
      logger.error(`Error fetching all tags: ${error}`);
      throw error;
    }
  }

  /**
   * Update tag name
   */
  async updateTag(id: string, name: string): Promise<Tag | null> {
    try {
      logger.info(`Updating tag with ID: ${id}`);

      // Check if tag exists
      const existingTag = await this.tagRepository.findById(id);
      if (!existingTag) {
        throw new Error(`Tag with ID ${id} not found`);
      }

      // Validate new name
      if (!name || name.trim().length === 0) {
        throw new Error("Tag name is required");
      }

      const normalizedName = name.toLowerCase().trim();

      if (normalizedName.length < 2) {
        throw new Error("Tag name must be at least 2 characters long");
      }

      if (normalizedName.length > 50) {
        throw new Error("Tag name cannot exceed 50 characters");
      }

      // Check if another tag with same name exists
      const tagWithSameName =
        await this.tagRepository.findByName(normalizedName);
      if (tagWithSameName && tagWithSameName.id !== id) {
        throw new Error(`Tag with name "${normalizedName}" already exists`);
      }

      const updatedTag = await this.tagRepository.update(id, {
        name: normalizedName,
      });

      logger.info(`Tag updated successfully: ${updatedTag?.name}`);
      return updatedTag;
    } catch (error) {
      logger.error(`Error updating tag: ${error}`);
      throw error;
    }
  }

  /**
   * Delete tag
   */
  async deleteTag(id: string): Promise<boolean> {
    try {
      logger.info(`Deleting tag with ID: ${id}`);

      // Check if tag exists
      const existingTag = await this.tagRepository.findById(id);
      if (!existingTag) {
        throw new Error(`Tag with ID ${id} not found`);
      }

      const deleted = await this.tagRepository.delete(id);

      if (deleted) {
        logger.info(`Tag with ID ${id} deleted successfully`);
      } else {
        logger.warn(`Failed to delete tag with ID ${id}`);
      }

      return deleted;
    } catch (error) {
      logger.error(`Error deleting tag: ${error}`);
      throw error;
    }
  }

  /**
   * Search tags by partial name
   */
  async searchTags(query: string): Promise<Tag[]> {
    try {
      logger.info(`Searching tags with query: ${query}`);

      if (!query || query.trim().length === 0) {
        throw new Error("Search query is required");
      }

      const normalizedQuery = query.toLowerCase().trim();

      if (normalizedQuery.length < 2) {
        throw new Error("Search query must be at least 2 characters long");
      }

      const tags = await this.tagRepository.findByPartialName(normalizedQuery);

      logger.info(`Found ${tags.length} tags matching query: ${query}`);
      return tags;
    } catch (error) {
      logger.error(`Error searching tags: ${error}`);
      throw error;
    }
  }

  /**
   * Search tags by keyword
   */
  async searchTagsByKeyword(keyword: string): Promise<Tag[]> {
    try {
      logger.info(`Searching tags by keyword: ${keyword}`);

      if (!keyword || keyword.trim().length === 0) {
        throw new Error("Keyword is required");
      }

      const normalizedKeyword = keyword.toLowerCase().trim();
      const tags = await this.tagRepository.searchByKeyword(normalizedKeyword);

      logger.info(`Found ${tags.length} tags matching keyword: ${keyword}`);
      return tags;
    } catch (error) {
      logger.error(`Error searching tags by keyword: ${error}`);
      throw error;
    }
  }

  /**
   * Get most used tags
   */
  async getMostUsedTags(limit: number = 10): Promise<Tag[]> {
    try {
      logger.info(`Fetching ${limit} most used tags`);

      if (limit <= 0 || limit > 100) {
        throw new Error("Limit must be between 1 and 100");
      }

      const tags = await this.tagRepository.findMostUsedTags(limit);

      logger.info(`Found ${tags.length} most used tags`);
      return tags;
    } catch (error) {
      logger.error(`Error fetching most used tags: ${error}`);
      throw error;
    }
  }

  /**
   * Get tags used by a specific user
   */
  async getUserTags(userId: string): Promise<Tag[]> {
    try {
      logger.info(`Fetching tags used by user: ${userId}`);

      if (!userId || userId.trim().length === 0) {
        throw new Error("User ID is required");
      }

      const tags = await this.tagRepository.findTagsUsedByUser(userId);

      logger.info(`Found ${tags.length} tags used by user ${userId}`);
      return tags;
    } catch (error) {
      logger.error(`Error fetching user tags: ${error}`);
      throw error;
    }
  }

  /**
   * Find or create tag by name
   */
  async findOrCreateTag(name: string): Promise<Tag> {
    try {
      logger.info(`Finding or creating tag: ${name}`);

      if (!name || name.trim().length === 0) {
        throw new Error("Tag name is required");
      }

      const normalizedName = name.toLowerCase().trim();

      if (normalizedName.length < 2) {
        throw new Error("Tag name must be at least 2 characters long");
      }

      if (normalizedName.length > 50) {
        throw new Error("Tag name cannot exceed 50 characters");
      }

      const tag = await this.tagRepository.findOrCreate(normalizedName);

      logger.info(`Tag found/created: ${tag.name} (ID: ${tag.id})`);
      return tag;
    } catch (error) {
      logger.error(`Error finding or creating tag: ${error}`);
      throw error;
    }
  }

  /**
   * Bulk create tags
   */
  async bulkCreateTags(tagNames: string[]): Promise<{
    created: Tag[];
    existing: Tag[];
    invalid: string[];
  }> {
    try {
      logger.info(`Bulk creating ${tagNames.length} tags`);

      if (!tagNames || tagNames.length === 0) {
        throw new Error("Tag names array is required");
      }

      const results = {
        created: [] as Tag[],
        existing: [] as Tag[],
        invalid: [] as string[],
      };

      // Normalize and validate tag names
      const normalizedNames: string[] = [];

      for (const name of tagNames) {
        if (!name || name.trim().length === 0) {
          results.invalid.push(name || "");
          continue;
        }

        const normalizedName = name.toLowerCase().trim();

        if (normalizedName.length < 2 || normalizedName.length > 50) {
          results.invalid.push(name);
          continue;
        }

        // Avoid duplicates in the input array
        if (!normalizedNames.includes(normalizedName)) {
          normalizedNames.push(normalizedName);
        }
      }

      // Process each normalized name
      for (const normalizedName of normalizedNames) {
        try {
          const existingTag =
            await this.tagRepository.findByName(normalizedName);

          if (existingTag) {
            results.existing.push(existingTag);
          } else {
            const newTag = await this.tagRepository.create({
              name: normalizedName,
            } as any);
            results.created.push(newTag);
          }
        } catch (error) {
          results.invalid.push(normalizedName);
        }
      }

      logger.info(
        `Bulk create completed: ${results.created.length} created, ${results.existing.length} existing, ${results.invalid.length} invalid`,
      );
      return results;
    } catch (error) {
      logger.error(`Error in bulk tag creation: ${error}`);
      throw error;
    }
  }

  /**
   * Get tag statistics
   */
  async getTagStatistics(): Promise<{
    totalTags: number;
    mostUsedTag: Tag | null;
    averageUsage: number;
    recentlyCreated: Tag[];
  }> {
    try {
      logger.info("Fetching tag statistics");

      const stats = await this.tagRepository.getTagsStatistics();

      // Get recently created tags (last 10)
      const allTags = await this.tagRepository.findAll();
      const recentlyCreated = allTags
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 10);

      const result = {
        totalTags: stats.totalTags,
        mostUsedTag: stats.mostUsedTag,
        averageUsage: stats.averageUsage,
        recentlyCreated,
      };

      logger.info("Tag statistics:", result);
      return result;
    } catch (error) {
      logger.error(`Error fetching tag statistics: ${error}`);
      throw error;
    }
  }

  /**
   * Delete unused tags
   */
  async deleteUnusedTags(): Promise<number> {
    try {
      logger.info("Deleting unused tags");

      const deletedCount = await this.tagRepository.deleteUnusedTags();

      logger.info(`Deleted ${deletedCount} unused tags`);
      return deletedCount;
    } catch (error) {
      logger.error(`Error deleting unused tags: ${error}`);
      throw error;
    }
  }

  /**
   * Check if tag name exists
   */
  async checkTagNameExists(name: string, excludeId?: string): Promise<boolean> {
    try {
      logger.info(`Checking if tag name exists: ${name}`);

      if (!name || name.trim().length === 0) {
        throw new Error("Tag name is required");
      }

      const normalizedName = name.toLowerCase().trim();
      const exists = await this.tagRepository.nameExists(
        normalizedName,
        excludeId,
      );

      logger.info(`Tag name "${name}" exists: ${exists}`);
      return exists;
    } catch (error) {
      logger.error(`Error checking tag name existence: ${error}`);
      throw error;
    }
  }

  /**
   * Get suggested tags based on partial input
   */
  async getSuggestedTags(input: string, limit: number = 5): Promise<Tag[]> {
    try {
      logger.info(`Getting suggested tags for input: ${input}`);

      if (!input || input.trim().length === 0) {
        // Return most used tags if no input
        return this.getMostUsedTags(limit);
      }

      const normalizedInput = input.toLowerCase().trim();

      if (normalizedInput.length < 2) {
        return this.getMostUsedTags(limit);
      }

      const suggestions =
        await this.tagRepository.findByPartialName(normalizedInput);

      // Limit results
      const limitedSuggestions = suggestions.slice(0, limit);

      logger.info(
        `Found ${limitedSuggestions.length} suggested tags for input: ${input}`,
      );
      return limitedSuggestions;
    } catch (error) {
      logger.error(`Error getting suggested tags: ${error}`);
      throw error;
    }
  }
}
