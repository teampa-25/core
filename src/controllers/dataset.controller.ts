import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DatasetService } from "@/services/dataset.service";
import { catchAsync } from "@/common/utils/catchAsync";

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
   * @param req Request containing the dataset name and tags
   * @param res Response object to send back the created dataset
   * @returns a response with the created dataset or an error
   */
  create = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { name, tags } = req.body;
    const dataset = await this.datasetService.createDataset(userId, {
      name,
      tags,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Dataset created successfully",
      dataset,
    });
  });

  /**
   * Deletes a dataset
   * @param req Request containing the dataset ID
   * @param res Response object to send back the deletion status
   * @returns the id of the deleted dataset
   */
  delete = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { id } = req.params;
    const deleteId = await this.datasetService.deleteDataset(id, userId);

    return res
      .status(StatusCodes.OK)
      .json({ message: `Dataset ${deleteId} deleted successfully` });
  });

  /**
   * Gets the list of datasets for the authenticated user
   * @param req Request object containing the user ID and tags
   * @param res Response object to send back the list of datasets
   * @returns a response with the list of datasets
   */
  getAll = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { tags } = req.query;

    const tagList = tags ? (Array.isArray(tags) ? tags : [tags]) : [];
    const filters =
      tagList.length > 0 ? { tags: tagList as string[] } : undefined;

    const datasets = await this.datasetService.getDatasets(userId, filters);

    return res.status(StatusCodes.OK).json({ datasets });
  });

  /**
   * Updates a dataset
   * @param req Request containing the dataset ID and updated name and tags
   * @param res Response object to send back the updated dataset
   * @returns a response with the updated dataset or an error
   */
  update = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;

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
   * @param req Request containing the dataset ID and video files
   * @param res Response object to send back the updated dataset
   * @returns a response with the updated dataset or an error
   */
  uploadVideo = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { id } = req.params;
    const { name, type } = req.body;
    const file = req.file;

    const content = file!.buffer;

    const result = await this.datasetService.uploadVideo(
      id,
      userId,
      content,
      name,
      type,
    );

    return res.status(StatusCodes.OK).json(result);
  });

  /**
   * Gets a dataset by ID
   * @param req Request containing the dataset ID
   * @param res Response object to send back the dataset
   * @returns a response with the dataset or an error
   */
  getById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const dataset = await this.datasetService.getDatasetById(id, userId);

    return res.status(StatusCodes.OK).json({ dataset });
  });
}
