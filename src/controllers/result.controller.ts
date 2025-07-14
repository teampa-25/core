import { Request, Response } from "express";
import { ResultService } from "@/services/result.service";
import { catchAsync } from "@/utils/catchAsync";
import { StatusCodes } from "http-status-codes";

/**
 * ResultController handles requests related to inference job results.
 * It provides methods to get JSON results, image ZIPs, and complete result metadata.
 */
export class ResultController {
  private resultService: ResultService;

  constructor() {
    this.resultService = new ResultService();
  }

  /**
   * Get JSON result by inference job ID
   * Route: GET /result/json/:inferenceJobId
   */
  getJsonResult = catchAsync(async (req: Request, res: Response) => {
    const { inferenceJobId } = req.params;

    const jsonResult =
      await this.resultService.getJsonResultByInferenceJobId(inferenceJobId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: jsonResult,
    });
  });

  /**
   * Get image ZIP result by inference job ID
   * Route: GET /result/images/:inferenceJobId
   */
  getImageZip = catchAsync(async (req: Request, res: Response) => {
    const { inferenceJobId } = req.params;

    const imageZip =
      await this.resultService.getImageZipByInferenceJobId(inferenceJobId);

    // Set headers for ZIP file download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="inference_result_${inferenceJobId}.zip"`,
    );

    res.send(imageZip);
  });

  /**
   * Get complete result by inference job ID
   * Route: GET /result/:inferenceJobId
   */
  getResult = catchAsync(async (req: Request, res: Response) => {
    const { inferenceJobId } = req.params;

    const result =
      await this.resultService.getResultByInferenceJobId(inferenceJobId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        id: result.id,
        inference_job_id: result.inference_job_id,
        json_res: result.json_res,
        created_at: result.created_at,
        updated_at: result.updated_at,
        // Note: image_zip is excluded from JSON response due to size
      },
    });
  });
}
