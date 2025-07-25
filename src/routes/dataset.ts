import { authorize } from "@/middlewares/authorize.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { upload } from "../middlewares/multer.middleware";
import { UserRole } from "@/common/enums";
import { Router } from "express";
import { DatasetController } from "@/controllers/dataset.controller";
import { DatasetSchema, IdSchema } from "@/common/utils/validation-schema";

const router = Router();
const datasetController = new DatasetController();

router.use(authenticate, authorize(UserRole.USER, UserRole.ADMIN)); // Apply authentication middleware to all routes in this router

// Create a new dataset
router.post("/", validate(DatasetSchema.create), datasetController.create);

// Logically delete a dataset
router.delete(
  "/:id",
  validate(IdSchema, "params"),
  // AUTHORIZE
  datasetController.delete,
);

// Get the list of all datasets or filtered
router.get("/", validate(DatasetSchema.get, "query"), datasetController.getAll);

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
  upload.single("content"),
  validate(IdSchema, "params"),
  validate(DatasetSchema.uploadVideo),
  datasetController.uploadVideo,
);

// Get a single dataset by id (already present)
router.get("/:id", validate(IdSchema, "params"), datasetController.getById);

export default router;
