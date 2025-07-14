import { NextFunction, Request, Response } from "express";
import { Dataset } from "@/models/dataset";
import { StatusCodes } from "http-status-codes";
import { DatasetService } from "@/services/dataset.service";
import { catchAsync } from "@/utils/catchAsync";
import { ErrorEnum, getError } from "@/utils/api.error";

/**
 * Dataset Controller where all the dataset-related endpoints are defined.
 * This controller handles the creation, deletion, retrieval, and updating of datasets.
 */
export class DatasetController {
  private datasetService: DatasetService;

  constructor() {
    this.datasetService = new DatasetService();
  }

  /**
   * Creates a new dataset
   * @returns a response with the created dataset or an error
   */
  create = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);

    const { name, tags } = req.body;
    const dataset = await this.datasetService.createDataset(userId, {
      name,
      tags,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Dataset creato con successo",
      dataset,
    });
  });

  /**
   * Deletes a dataset
   * @returns a response indicating success or failure
   */
  delete = catchAsync(async (req: Request, res: Response) => {
    // could validation be better? - beg
    const userId = req.user?.id;
    if (!userId) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);

    const { id } = req.params;
    const deleted = await this.datasetService.deleteDataset(id, userId);

    if (!deleted) {
      const error = getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
      return res.status(error.status).json({ message: error.msg });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Dataset cancellato con successo" });
  });

  /**
   * Gets the list of datasets for the authenticated user
   * @returns a response with the list of datasets
   */
  getAll = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);

    const tags = req.query.tags;
    const filters = tags
      ? { tags: Array.isArray(tags) ? (tags as string[]) : [tags as string] }
      : undefined;

    const datasets = await this.datasetService.getDatasets(userId, filters);

    return res.status(StatusCodes.OK).json({ datasets });
  });

  /**
   * Updates a dataset
   * @returns a response with the updated dataset or an error
   */
  update = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);

    const { id } = req.params;
    const { name, tags } = req.body;

    const dataset = await this.datasetService.updateDataset(id, userId, {
      name,
      tags,
    });

    return res.status(StatusCodes.OK).json({
      message: "Dataset updated successfully",
      dataset,
    });
  });

  /**
   * Upload videos to a dataset
   * @returns a response with the updated dataset or an error
   */
  uploadVideo = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);

    const { id } = req.params;
    const content: Buffer = req.body.content;
    const type: string = req.body.type;

    const result = await this.datasetService.uploadVideo(
      id,
      userId,
      content,
      type,
    );

    // TODO: before sending ok check that all is good -beg
    //
    return res.status(StatusCodes.OK).json(result);
  });

  /**
   * Gets a dataset by ID
   * @returns a response with the dataset or an error
   */
  getById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dataset = await this.datasetService.getDatasetById(id);
    if (!dataset) {
      const error = getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
      return res.status(error.status).json({ message: error.msg });
    }
    return res.status(StatusCodes.OK).json({ dataset });
  });
}
