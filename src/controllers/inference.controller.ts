import { InferenceJobService } from "@/services/inference.service";
import { catchAsync } from "@/common/utils/catchAsync";
import { Request, Response } from "express";
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
   * Creates a new inference job for a user.
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
   * is also returns JSON results if status is COMPLETED and failing reason if status is FAILED
   * @param req Request containing jobId parameter
   * @param res Response object to send back status
   * @returns Promise resolving to job status
   */
  getInferenceStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await this.inferenceJobService.getInferenceStatusWithResults(id);

    if (result && result !== null) {
      res.status(StatusCodes.OK).json(result);
    } else {
      res.status(StatusCodes.OK).json({ status: result });
    }
  });

  /**
   * Gets the JSON results of a completed inference job
   * @param req Request containing jobId parameter
   * @param res Response object to send back JSON results
   * @returns Promise resolving to job results in JSON format
   */
  getInferenceJSONResults = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const json = await this.inferenceJobService.getInferenceJSONResults(id);
    res.status(StatusCodes.OK).json({ results: json });
  });

  /**
   * Gets the ZIP results of a completed inference job
   * @param req Request containing jobId parameter
   * @param res Response object to send back ZIP results
   * @returns Promise resolving to job results in ZIP format
   */
  getInferenceZIPResults = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const zip = await this.inferenceJobService.getInferenceZIPResultsPath(id);
    // res.status(StatusCodes.OK).sendFile(`/files/${req.user!.id}/results/result_${id}.zip`);
    res.status(StatusCodes.OK).sendFile(zip);
  });
}
