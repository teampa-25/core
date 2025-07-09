import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../config/config";

const router = Router();

// Health check endpoint
router.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

export default router;

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoint
 */

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     tags:
 *        - Health
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Health check is working!
 */
