import { Router } from "express";
import { DatasetController } from "@/controllers/dataset.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { DatasetSchema, IdSchema } from "@/utils/validation-schema";
import { param } from "express-validator";

const router = Router();
const datasetController = new DatasetController();

router.use(authenticate); // Apply authentication middleware to all routes in this router

// Create a new dataset
router.post(
  "/",
  validate(DatasetSchema.create),
  datasetController.createDataset,
);

// Logically delete a dataset
router.delete(
  "/:id",
  validate(IdSchema, "params"),
  datasetController.deleteDataset,
);

// Get the list of datasets (with tag filtering)
router.get("/", datasetController.getDatasets);

// Update a dataset
router.put(
  "/:id",
  validate(IdSchema, "params"),
  validate(DatasetSchema.update),
  datasetController.updateDataset,
);

// Add videos or zip files to the dataset
router.post(
  "/:id/videos",
  validate(IdSchema, "params"),
  validate(DatasetSchema.addVideos),
  datasetController.addVideosToDataset,
);

// Get a dataset by id (already present)
router.get(
  "/:id",
  validate(IdSchema, "params"),
  datasetController.getDatasetById,
);

export default router;
