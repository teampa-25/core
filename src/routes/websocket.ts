import { Router } from "express";
import { WebSocketController } from "@/controllers/websocket.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";

const router = Router();
const wsController = new WebSocketController();

router.get("/stats", authenticate, wsController.getConnectionStats);

router.post("/test", authenticate, wsController.testNotification);

export default router;
