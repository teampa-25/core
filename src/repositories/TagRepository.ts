import { Tag } from "../database/models";
import {
  TagDAO,
  TagCreateAttributes,
  TagUpdateAttributes,
} from "../dao/TagDAO";
import { ITagRepository } from "./interfaces/ITagRepository";

/**
 * Tag repository implementation
 * Provides business logic layer over TagDAO
 */
export class TagRepository implements ITagRepository {
  constructor(private tagDAO: TagDAO) {}

  async create(data: TagCreateAttributes): Promise<Tag> {
    return this.tagDAO.create(data);
  }

  async findById(id: string): Promise<Tag | null> {
    return this.tagDAO.findById(id);
  }

  async findAll(options?: any): Promise<Tag[]> {
    return this.tagDAO.findAll(options);
  }

  async update(id: string, data: TagUpdateAttributes): Promise<Tag | null> {
    return this.tagDAO.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.tagDAO.delete(id);
  }

  async findBy(criteria: any): Promise<Tag[]> {
    return this.tagDAO.findBy(criteria);
  }

  async findOneBy(criteria: any): Promise<Tag | null> {
    return this.tagDAO.findOneBy(criteria);
  }

  async count(criteria?: any): Promise<number> {
    return this.tagDAO.count(criteria);
  }

  // Tag-specific methods
  async findByName(name: string): Promise<Tag | null> {
    return this.tagDAO.findByName(name);
  }

  async findByPartialName(partialName: string): Promise<Tag[]> {
    return this.tagDAO.findByPartialName(partialName);
  }

  async findMostUsedTags(limit?: number): Promise<Tag[]> {
    return this.tagDAO.getPopularTags(limit || 10);
  }

  async findTagsUsedByUser(userId: string): Promise<Tag[]> {
    // TODO: implement logic to find tags used by a specific user
    return this.tagDAO.findAll();
  }

  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    return this.tagDAO.nameExists(name, excludeId);
  }

  async findOrCreate(name: string): Promise<Tag> {
    return this.tagDAO.findOrCreate(name);
  }

  async searchByKeyword(keyword: string): Promise<Tag[]> {
    return this.tagDAO.searchTags(keyword);
  }

  async getTagsStatistics(): Promise<{
    totalTags: number;
    mostUsedTag: Tag | null;
    averageUsage: number;
  }> {
    const totalTags = await this.tagDAO.count();
    const allTags = await this.tagDAO.findAll();

    return {
      totalTags,
      mostUsedTag: allTags.length > 0 ? allTags[0] : null, // Semplificato
      averageUsage: 0, // Richiederebbe relazioni con dataset
    };
  }

  async bulkCreate(tagNames: string[]): Promise<Tag[]> {
    return this.tagDAO.bulkFindOrCreate(tagNames);
  }

  async deleteUnusedTags(): Promise<number> {
    return this.tagDAO.deleteUnusedTags();
  }
}
