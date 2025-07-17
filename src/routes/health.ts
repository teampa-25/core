import { Router } from "express";
import { HealthController } from "@/controllers/health.controller";

const router = Router();

const controller = new HealthController();

// server health check route
router.get("/", controller.ping);

export default router;
