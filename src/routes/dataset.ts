import { Router } from "express";
import * as DatasetController from "@/controllers/dataset.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";

const router = Router();

// Create a new dataset
router.post("/", authenticate, DatasetController.createDataset);

// Logically delete a dataset
router.delete("/:id", authenticate, DatasetController.deleteDataset);

// Get the list of datasets (with tag filtering)
router.get("/", authenticate, DatasetController.getDatasets);

// Update a dataset
router.put("/:id", authenticate, DatasetController.updateDataset);

// Add videos or zip files to the dataset
router.post("/:id/videos", authenticate, DatasetController.addVideosToDataset);

// Get a dataset by id (already present)
router.get("/:id", authenticate, DatasetController.getDatasetById);

export default router;
