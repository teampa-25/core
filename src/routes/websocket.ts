import { Router } from "express";
import { WebSocketController } from "@/controllers/websocket.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";

const router = Router();
const wsController = new WebSocketController();

/**
 * @swagger
 * /api/websocket/stats:
 *   get:
 *     summary: Get WebSocket connection statistics
 *     description: Get information about WebSocket connections for the authenticated user
 *     tags: [WebSocket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connection statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalConnections:
 *                       type: number
 *                     userConnections:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", authenticate, wsController.getConnectionStats);

/**
 * @swagger
 * /api/websocket/test:
 *   post:
 *     summary: Send test WebSocket notification
 *     description: Send a test notification via WebSocket (development only)
 *     tags: [WebSocket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Test message to send
 *     responses:
 *       200:
 *         description: Test notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.post("/test", authenticate, wsController.testNotification);

export default router;
