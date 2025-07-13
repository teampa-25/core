import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class HealthController {
  async ping(req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).json({
      status: "Server is working1",
      timestamp: new Date().toISOString(),
    });
  }
}
