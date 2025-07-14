import { Router } from "express";
import { ResultController } from "@/controllers/result.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { IdSchema } from "@/utils/validation-schema";

const router = Router();
const resultController = new ResultController();

router.use(authenticate); // Apply authentication middleware to all routes

/**
 * Get JSON result by inference job ID
 * Route: GET /result/json/:inferenceJobId
 * Description: Returns the JSON result of a completed inference job
 */
router.get(
  "/json/:inferenceJobId",
  validate(IdSchema, "params"),
  resultController.getJsonResult,
);

/**
 * Get image ZIP result by inference job ID
 * Route: GET /result/images/:inferenceJobId
 * Description: Returns the ZIP file containing PNG images from a completed inference job
 */
router.get(
  "/images/:inferenceJobId",
  validate(IdSchema, "params"),
  resultController.getImageZip,
);

/**
 * Get complete result by inference job ID
 * Route: GET /result/:inferenceJobId
 * Description: Returns the complete result metadata (excluding image ZIP due to size)
 */
router.get(
  "/:inferenceJobId",
  validate(IdSchema, "params"),
  resultController.getResult,
);

export default router;
