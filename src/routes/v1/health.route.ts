import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../config/config";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

export default router;
