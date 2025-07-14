import { Router } from "express";
import { DatasetController } from "@/controllers/dataset.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { DatasetSchema, IdSchema, UserSchema } from "@/utils/validation.schema";
import { param } from "express-validator";
import { authorize } from "@/middlewares/authorize.middleware";

const router = Router();
const datasetController = new DatasetController();

router.use(authenticate); // Apply authentication middleware to all routes in this router

// Create a new dataset
router.post("/", validate(DatasetSchema.create), datasetController.create);

// Logically delete a dataset
router.delete(
  "/:id",
  validate(IdSchema, "params"),
  // AUTHOROIZE
  datasetController.delete,
);

// Get the list of all datasets or filtered
router.get("/", validate(DatasetSchema.get), datasetController.getAll);

// Update a dataset
router.put(
  "/:id",
  validate(IdSchema, "params"),
  validate(DatasetSchema.update),
  datasetController.update,
);

// Add videos or zip files to the dataset
router.post(
  "/:id/videos",
  validate(IdSchema, "params"),
  validate(DatasetSchema.uploadVideo, "body"),
  datasetController.uploadVideo,
);

// Get a dataset by id (already present)
router.get("/:id", validate(IdSchema, "params"), datasetController.getById);

export default router;
