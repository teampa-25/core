import { InferenceJobService } from "@/services/inference.service";
import { catchAsync } from "@/common/utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * InferenceJobController is responsible for handling inference job requests.
 * It provides methods to create, get status, and get results for an inference job.
 */
export class InferenceJobController {
  private inferenceJobService: InferenceJobService;

  constructor() {
    this.inferenceJobService = new InferenceJobService();
  }

  /**
   * @param req Request containing userId, datasetId and parameters
   * @param res Response object to send back jobId
   * @returns Promise resolving to created job ID
   */
  createInference = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { datasetId, parameters, range } = req.body;
    const jobId = await this.inferenceJobService.enqueueJob(
      userId,
      datasetId,
      parameters,
      range,
    );
    res.status(StatusCodes.CREATED).json({ jobId: jobId });
  });

  /**
   * Gets the status of an inference job
   * @param req Request containing jobId parameter
   * @param res Response object to send back status
   * @returns Promise resolving to job status
   */
  getInferenceStatus = catchAsync(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const status = this.inferenceJobService.getInferenceStatus(jobId);
    res.status(StatusCodes.OK).json({ status: status });
  });

  /**
   * Gets the JSON results of a completed inference job
   * @param req Request containing jobId parameter
   * @param res Response object to send back JSON results
   * @returns Promise resolving to job results in JSON format
   */
  getInferenceJSONResults = catchAsync(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const json = this.inferenceJobService.getInferenceJSONResults(jobId);
    res.status(StatusCodes.OK).json({ results: json });
  });

  /**
   * Gets the ZIP results of a completed inference job
   * @param req Request containing jobId parameter
   * @param res Response object to send back ZIP results
   * @returns Promise resolving to job results in ZIP format
   */
  getInferenceZIPResults = catchAsync(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const zip = this.inferenceJobService.getInferenceZIPResults(jobId);
    res.status(StatusCodes.OK).json({ results: zip });
  });
}
