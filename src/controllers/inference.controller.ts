import { InferenceJobService } from "@/services/inference.service";
import { catchAsync } from "@/utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class InferenceJobController {
  private inferenceJobService: InferenceJobService;

  constructor() {
    this.inferenceJobService = new InferenceJobService();
  }

  createInference = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const { datasetId, parameters } = req.body;

      const jobId = await this.inferenceJobService.enqueueJob(
        userId,
        datasetId,
        parameters,
      );
      res.status(StatusCodes.CREATED).json({ jobId: jobId });
    },
  );

  getInferenceStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { jobId } = req.params;
      const status = this.inferenceJobService.getInferenceStatus(jobId);
      res.status(StatusCodes.OK).json({ status: status });
    },
  );

  getInferenceJSONResults = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { jobId } = req.params;
      const json = this.inferenceJobService.getInferenceJSONResults(jobId);
      res.status(StatusCodes.OK).json({ results: json });
    },
  );

  getInferenceZIPResults = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { jobId } = req.params;
      const zip = this.inferenceJobService.getInferenceZIPResults(jobId);
      res.status(StatusCodes.OK).json({ results: zip });
    },
  );
}
