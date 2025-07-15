import { catchAsync } from "@/common/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class HealthController {
  /**
   * Ping the server to check if it is working
   * @param req Request object
   * @param res Response object
   * @returns Response object with status and timestamp
   */
  ping = catchAsync(async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      status: "Server is working!",
      timestamp: new Date().toISOString(),
    });
  });
}
