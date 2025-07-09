import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DatasetService } from "../services/DatasetService";
import { logger } from "../config/logger";

/**
 * Dataset Controller
 * Manage http requests for datasets using the DatasetService
 */
export class DatasetController {
  private datasetService: DatasetService;

  constructor() {
    this.datasetService = new DatasetService();
  }

  /**
   * CREATE - Create a new dataset
   * POST /api/v1/datasets
   */
  createDataset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, tags } = req.body;
      const userId = req.user?.id; // Assuming user is authenticated

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      const dataset = await this.datasetService.createDataset({
        user_id: userId,
        name,
        tags,
      });

      logger.info(`Dataset created via API: ${dataset.id}`);

      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Dataset created successfully",
        data: {
          dataset: {
            id: dataset.id,
            name: dataset.name,
            tags: dataset.tags,
            user_id: dataset.user_id,
            created_at: dataset.created_at,
            updatedAt: dataset.updatedAt,
          },
        },
      });
    } catch (error) {
      logger.error("Error creating dataset via API:", error);

      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to create dataset",
      });
    }
  };

  /**
   * READ - Retrieve all user datasets
   * GET /api/v1/datasets
   */
  getUserDatasets = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      // Parsing query parameters
      const tags = req.query.tags
        ? (req.query.tags as string).split(",")
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;

      const result = await this.datasetService.getUserDatasets(userId, {
        tags,
        limit,
        offset,
      });

      logger.info(
        `Retrieved ${result.datasets.length} datasets for user ${userId}`,
      );

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Datasets retrieved successfully",
        data: {
          datasets: result.datasets.map((dataset) => ({
            id: dataset.id,
            name: dataset.name,
            tags: dataset.tags,
            created_at: dataset.created_at,
            updatedAt: dataset.updatedAt,
          })),
          pagination: {
            total: result.total,
            count: result.datasets.length,
            limit: limit || result.total,
            offset: offset || 0,
          },
        },
      });
    } catch (error) {
      logger.error("Error retrieving user datasets via API:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to retrieve datasets",
      });
    }
  };

  /**
   * READ - Retrieve a specific dataset by ID
   * GET /api/v1/datasets/:id
   */
  getDatasetById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      const dataset = await this.datasetService.getDatasetById(id);

      if (!dataset) {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          message: "Dataset not found",
        });
        return;
      }

      // Verify that the dataset belongs to the user
      if (dataset.user_id !== userId) {
        res.status(StatusCodes.FORBIDDEN).json({
          status: "error",
          message: "Access denied",
        });
        return;
      }

      logger.info(`Dataset ${id} retrieved via API by user ${userId}`);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Dataset retrieved successfully",
        data: {
          dataset: {
            id: dataset.id,
            name: dataset.name,
            tags: dataset.tags,
            user_id: dataset.user_id,
            created_at: dataset.created_at,
            updatedAt: dataset.updatedAt,
          },
        },
      });
    } catch (error) {
      logger.error("Error retrieving dataset by ID via API:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to retrieve dataset",
      });
    }
  };

  /**
   * UPDATE - Update a dataset
   * PUT /api/v1/datasets/:id
   */
  updateDataset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, tags } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      const updatedDataset = await this.datasetService.updateDataset(
        id,
        userId,
        {
          name,
          tags,
        },
      );

      if (!updatedDataset) {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          message: "Dataset not found or access denied",
        });
        return;
      }

      logger.info(`Dataset ${id} updated via API by user ${userId}`);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Dataset updated successfully",
        data: {
          dataset: {
            id: updatedDataset.id,
            name: updatedDataset.name,
            tags: updatedDataset.tags,
            user_id: updatedDataset.user_id,
            created_at: updatedDataset.created_at,
            updatedAt: updatedDataset.updatedAt,
          },
        },
      });
    } catch (error) {
      logger.error("Error updating dataset via API:", error);

      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to update dataset",
      });
    }
  };

  /**
   * UPDATE - Update only the tags of a dataset
   * PATCH /api/v1/datasets/:id/tags
   */
  updateDatasetTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { tags } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      if (!Array.isArray(tags)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "Tags must be an array",
        });
        return;
      }

      const updatedDataset = await this.datasetService.updateDatasetTags(
        id,
        userId,
        tags,
      );

      if (!updatedDataset) {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          message: "Dataset not found or access denied",
        });
        return;
      }

      logger.info(`Dataset tags ${id} updated via API by user ${userId}`);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Dataset tags updated successfully",
        data: {
          dataset: {
            id: updatedDataset.id,
            name: updatedDataset.name,
            tags: updatedDataset.tags,
            updatedAt: updatedDataset.updatedAt,
          },
        },
      });
    } catch (error) {
      logger.error("Error updating dataset tags via API:", error);

      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update dataset tags",
      });
    }
  };

  /**
   * DELETE - (softly) Delete a dataset
   * DELETE /api/v1/datasets/:id
   */
  deleteDataset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      const deleted = await this.datasetService.deleteDataset(id, userId);

      if (!deleted) {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          message: "Dataset not found or access denied",
        });
        return;
      }

      logger.info(`Dataset ${id} deleted via API by user ${userId}`);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Dataset deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting dataset via API:", error);

      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete dataset",
      });
    }
  };

  /**
   * POST - Restore a deleted dataset
   * POST /api/v1/datasets/:id/restore
   */
  restoreDataset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      const restored = await this.datasetService.restoreDataset(id, userId);

      if (!restored) {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          message: "Dataset not found or access denied",
        });
        return;
      }

      logger.info(`Dataset ${id} restored via API by user ${userId}`);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Dataset restored successfully",
      });
    } catch (error) {
      logger.error("Error restoring dataset via API:", error);

      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to restore dataset",
      });
    }
  };

  /**
   * GET - Retrieve user dataset statistics
   * GET /api/v1/datasets/stats
   */
  getUserDatasetStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      const stats = await this.datasetService.getUserDatasetStats(userId);

      logger.info(`Dataset stats retrieved via API for user ${userId}`);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Dataset statistics retrieved successfully",
        data: {
          stats,
        },
      });
    } catch (error) {
      logger.error("Error retrieving dataset stats via API:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to retrieve dataset statistics",
      });
    }
  };

  /**
   * GET - Find dataset by name
   * GET /api/v1/datasets/search?q=query
   */
  searchDatasets = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { q: query } = req.query;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "error",
          message: "User authentication required",
        });
        return;
      }

      if (!query || typeof query !== "string") {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "Search query is required",
        });
        return;
      }

      const datasets = await this.datasetService.searchUserDatasets(
        userId,
        query,
      );

      logger.info(
        `Dataset search performed via API for user ${userId}, query: ${query}`,
      );

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Search completed successfully",
        data: {
          datasets: datasets.map((dataset) => ({
            id: dataset.id,
            name: dataset.name,
            tags: dataset.tags,
            created_at: dataset.created_at,
            updatedAt: dataset.updatedAt,
          })),
          query,
          count: datasets.length,
        },
      });
    } catch (error) {
      logger.error("Error searching datasets via API:", error);

      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: error instanceof Error ? error.message : "Search failed",
      });
    }
  };

  /**
   * GET - Retrieve datasets by specific tags
   * GET /api/v1/datasets/by-tags?tags=tag1,tag2
   */
  getDatasetsByTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tags: tagsQuery } = req.query;

      if (!tagsQuery || typeof tagsQuery !== "string") {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "Tags query parameter is required",
        });
        return;
      }

      const tags = tagsQuery
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (tags.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "At least one valid tag is required",
        });
        return;
      }

      const datasets = await this.datasetService.getDatasetsByTags(tags);

      logger.info(`Datasets retrieved by tags via API: ${tags.join(", ")}`);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Datasets retrieved by tags successfully",
        data: {
          datasets: datasets.map((dataset) => ({
            id: dataset.id,
            name: dataset.name,
            tags: dataset.tags,
            user_id: dataset.user_id,
            created_at: dataset.created_at,
            updatedAt: dataset.updatedAt,
          })),
          searchTags: tags,
          count: datasets.length,
        },
      });
    } catch (error) {
      logger.error("Error retrieving datasets by tags via API:", error);

      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve datasets by tags",
      });
    }
  };
}
