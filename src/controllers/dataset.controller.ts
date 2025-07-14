import { Request, Response } from "express";
import { Dataset } from "@/models/dataset";
import { StatusCodes } from "http-status-codes";
import { DatasetService } from "@/services/dataset.service";
import { catchAsync } from "@/utils/catchAsync";
import { ErrorEnum, getError } from "@/utils/api-error";

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
   * @param req
   * @param res
   * @returns a response with the created dataset or an error
   */
  createDataset = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj();
      return res.status(error.status).json({ message: error.msg });
    }

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
   * @param req
   * @param res
   * @returns a response indicating success or failure
   */
  deleteDataset = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj();
      return res.status(error.status).json({ message: error.msg });
    }

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
   * @param req
   * @param res
   * @returns a response with the list of datasets
   */
  getDatasets = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj();
      return res.status(error.status).json({ message: error.msg });
    }

    const tags = req.query.tags;
    const filters = tags
      ? { tags: Array.isArray(tags) ? (tags as string[]) : [tags as string] }
      : undefined;

    const datasets = await this.datasetService.getDatasets(userId, filters);

    return res.status(StatusCodes.OK).json({ datasets });
  });

  /**
   * Updates a dataset
   * @param req
   * @param res
   * @returns a response with the updated dataset or an error
   */
  updateDataset = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj();
      return res.status(error.status).json({ message: error.msg });
    }

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
   * Adds videos to a dataset
   * @param req
   * @param res
   * @returns a response with the updated dataset or an error
   */
  addVideosToDataset = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj();
      return res.status(error.status).json({ message: error.msg });
    }

    const { id } = req.params;
    const videos = req.body.videos;

    const result = await this.datasetService.addVideosToDataset(
      id,
      userId,
      videos,
    );

    return res.status(StatusCodes.OK).json(result);
  });

  /**
   * Gets a dataset by ID
   * @param req
   * @param res
   * @returns a response with the dataset or an error
   */
  getDatasetById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dataset = await this.datasetService.getDatasetById(id);
    if (!dataset) {
      const error = getError(ErrorEnum.NOT_FOUND_ERROR).getErrorObj();
      return res.status(error.status).json({ message: error.msg });
    }
    return res.status(StatusCodes.OK).json({ dataset });
  });
}

// import { Request, Response } from "express";
// import { Dataset } from "@/models/dataset";
// import { StatusCodes } from "http-status-codes";

// export const getDatasetById = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const dataset = await Dataset.findByPk(id);

//     if (!dataset) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: "Dataset not found" });
//     }

//     return res.status(StatusCodes.OK).json({ dataset });
//   } catch (error) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching dataset", error });
//   }
// };
