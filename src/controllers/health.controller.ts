import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class HealthController {
  ping = catchAsync(async (req: Request, res: Response, NextFunction) => {
    res.status(StatusCodes.OK).json({
      status: "Server is working1",
      timestamp: new Date().toISOString(),
    });
  });
}
