import { InferenceJobController } from "@/controllers/inference.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { UserRole } from "@/common/enums";
import { IdSchema, InferenceSchema } from "@/common/utils/validation-schema";
import { Router } from "express";

const router = Router();

const inferenceJobController = new InferenceJobController();

router.use(authenticate);
router.use(authorize(UserRole.USER));

// create new inference
router.post(
  "/",
  validate(InferenceSchema.create),
  inferenceJobController.createInference,
);

// get inference status by id
router.get(
  "/status/:id",
  validate(IdSchema, "params"),
  inferenceJobController.getInferenceStatus,
);

// get json results by inference id
router.get(
  "/result/json/:id",
  validate(IdSchema, "params"),
  inferenceJobController.getInferenceJSONResults,
);

// get zip results by inference id
router.get(
  "/result/zip/:id",
  validate(IdSchema, "params"),
  inferenceJobController.getInferenceZIPResults,
);

export default router;
