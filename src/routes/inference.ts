import { InferenceJobController } from "@/controllers/inference.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { UserRole } from "@/models/enums/user.role";
import { IdSchema } from "@/utils/validation-schema";
import { Router } from "express";

const router = Router();

const inferenceJobController = new InferenceJobController();

router.use(authenticate);
router.use(authorize(UserRole.USER));

//add validation
router.post("/", inferenceJobController.createInference);

router.get(
  "/status/:id",
  validate(IdSchema, "params"),
  inferenceJobController.getInferenceStatus,
);

router.get(
  "/result/json/:id",
  validate(IdSchema, "params"),
  inferenceJobController.getInferenceJSONResults,
);

router.get(
  "/result/zip/:id",
  validate(IdSchema, "params"),
  inferenceJobController.getInferenceZIPResults,
);
