import { Request, Response } from "express";
import { WebSocketService } from "@/services/websocket.service";
import { catchAsync } from "@/common/utils/catchAsync";
import { StatusCodes } from "http-status-codes";

/**
 * Controller for WebSocket related operations.
 * Provides endpoints for monitoring WebSocket connections.
 */
export class WebSocketController {
  private wsService: WebSocketService;

  constructor() {
    this.wsService = WebSocketService.getInstance();
  }

  /**
   * Get WebSocket connection statistics
   * @param req - Express request object
   * @param res - Express response object
   */
  public getConnectionStats = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const totalConnections = this.wsService.getTotalConnectionCount();
      const userConnections = req.user
        ? this.wsService.getUserConnectionCount(req.user.id)
        : 0;

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          totalConnections,
          userConnections,
        },
      });
    },
  );

  /**
   * Test WebSocket notification (dev)
   * @param req - Express request object
   * @param res - Express response object
   */
  public testNotification = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { message } = req.body;

      if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      this.wsService.notifyUser(req.user.id, {
        type: "TEST_NOTIFICATION",
        data: {
          inferenceId: "test-id",
          status: "TEST",
          errorMessage: message,
        },
        timestamp: new Date(),
      });

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Test notification sent",
      });
    },
  );
}
