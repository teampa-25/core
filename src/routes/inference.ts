import { InferenceJobController } from "@/controllers/inference-job.controller";
import { Router } from "express";

const router = Router();

const inferenceJobController = new InferenceJobController();

router.post("/", inferenceJobController.createInference);

export default router;
