import { InferenceJobController } from "@/controllers/inference-job.controller";
import { Router } from "express";

const router = Router();

const inferenceJobController = new InferenceJobController();

router.post("/inference", inferenceJobController.createInference);
