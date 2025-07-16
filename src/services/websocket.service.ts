import { WebSocketServer, WebSocket } from "ws";
import { Server as HttpServer } from "http";
import { WebSocketNotification } from "@/common/types";
import { ErrorEnum, InferenceJobStatus } from "@/common/enums";
import { getError } from "@/common/utils/api-error";
import { logger } from "@/config/logger";
import { IncomingMessage } from "http";
import { WEBSOCKET } from "@/common/const";
import { JwtUtils } from "@/common/utils/jwt";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAuthenticated?: boolean;
}

/**
 * WebSocket service for managing real-time notifications to users.
 * Implements singleton pattern to ensure single instance across the application.
 */
export class WebSocketService {
  private static instance: WebSocketService;
  private wss!: WebSocketServer; // TODO I have doubt bout that '!'
  private userConnections: Map<string, AuthenticatedWebSocket[]> = new Map();

  private constructor() {}

  /**
   * Get singleton instance of WebSocketService
   * @returns WebSocketService instance
   */
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Initialize WebSocket server with HTTP server
   * @param httpServer - HTTP server instance
   */
  public initialize(httpServer: HttpServer): void {
    this.wss = new WebSocketServer({
      server: httpServer,
      path: "/ws",
    });

    this.setupEventHandlers();
    logger.info("WebSocket service initialized");
  }

  /**
   * Setup event handlers for WebSocket connections
   */
  private setupEventHandlers(): void {
    this.wss.on(
      "connection",
      (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
        const connectionId = this.generateConnectionId();
        logger.info(`New WebSocket connection: ${connectionId}`);

        ws.isAuthenticated = false;

        // Handle disconnection
        ws.on("close", () => {
          this.handleDisconnection(ws, connectionId);
        });

        // Handle connection errors
        ws.on("error", (error: Error) => {
          logger.error(`WebSocket error on ${connectionId}:`, error);
        });

        // Send initial connection message
        this.sendMessage(ws, {
          type: "connection",
          data: {
            message: "WebSocket connection established. Please authenticate.",
          },
          timestamp: new Date(),
        });
      },
    );
  }

  /**
   * Handle client authentication
   * @param ws - WebSocket connection
   * @param token - JWT token
   * @param connectionId - Connection identifier
   */
  private handleAuthentication(
    ws: AuthenticatedWebSocket,
    token: string,
    connectionId: string,
  ): void {
    try {
      const decoded = JwtUtils.verifyToken(token);

      // Store user connection
      if (!this.userConnections.has(decoded.id)) {
        this.userConnections.set(decoded.id, []);
      }
      this.userConnections.get(decoded.id)!.push(ws);

      ws.userId = decoded.id;
      ws.isAuthenticated = true;

      this.sendMessage(ws, {
        type: "authenticated",
        data: { success: true, userId: decoded.id },
        timestamp: new Date(),
      });

      logger.info(
        `User ${decoded.id} authenticated on connection ${connectionId}`,
      );
    } catch (error) {
      logger.error(
        `Authentication failed for connection ${connectionId}:`,
        error,
      );
      this.sendError(
        ws,
        getError(ErrorEnum.UNAUTHORIZED_ERROR).getErrorObj().msg,
      );
      ws.close(WEBSOCKET.POLICY_VIOLATION, "Authentication failed");
    }
  }

  /**
   * Handle client disconnection
   * @param ws - WebSocket connection
   * @param connectionId - Connection identifier
   */
  private handleDisconnection(
    ws: AuthenticatedWebSocket,
    connectionId: string,
  ): void {
    const userId = ws.userId;
    if (userId) {
      const userSockets = this.userConnections.get(userId);
      if (userSockets) {
        const index = userSockets.indexOf(ws);
        if (index > -1) {
          userSockets.splice(index, 1);
        }
        if (userSockets.length === 0) {
          this.userConnections.delete(userId);
        }
      }
      logger.info(
        `User ${userId} disconnected from connection ${connectionId}`,
      );
    } else {
      logger.info(`Unauthenticated connection ${connectionId} disconnected`);
    }
  }

  /**
   * Send message to a WebSocket connection
   * @param ws - WebSocket connection
   * @param message - Message to send
   */
  private sendMessage(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send error message to a WebSocket connection
   * @param ws - WebSocket connection
   * @param errorMessage - Error message
   */
  private sendError(ws: WebSocket, errorMessage: string): void {
    this.sendMessage(ws, {
      type: "error",
      data: { error: errorMessage },
      timestamp: new Date(),
    });
  }

  /**
   * Generate unique connection ID
   * @returns Unique connection identifier
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Send notification to a specific user
   * @param userId - User ID to send notification to
   * @param notification - Notification data
   */
  public notifyUser(userId: string, notification: WebSocketNotification): void {
    const userSockets = this.userConnections.get(userId);
    if (userSockets && userSockets.length > 0) {
      const message = {
        ...notification,
        type: "notification",
      };

      userSockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          this.sendMessage(ws, message);
        }
      });

      logger.info(`Notification sent to user ${userId}: ${notification.type}`);
    } else {
      logger.warn(`No active connections for user ${userId}`);
    }
  }

  /**
   * Send inference status update to user
   * @param userId - User ID
   * @param inferenceId - Inference job ID
   * @param status - New status
   * @param result - Result data (only when inference status is completed, optional)
   * @param errorMessage - Error message (only when inference status is failed or aborted, optional)
   */
  public notifyInferenceStatusUpdate(
    userId: string,
    inferenceId: string,
    status: string,
    result?: any,
    errorMessage?: string,
  ): void {
    const notification: WebSocketNotification = {
      type: "INFERENCE_STATUS_UPDATE",
      data: {
        inferenceId,
        status,
        result: status === InferenceJobStatus.COMPLETED ? result : undefined,
        errorMessage:
          status === InferenceJobStatus.FAILED ||
          status === InferenceJobStatus.ABORTED
            ? errorMessage
            : undefined,
      },
      timestamp: new Date(),
    };

    this.notifyUser(userId, notification);
  }

  /**
   * Get number of active connections for a user
   * @param userId - User ID
   * @returns Number of active connections
   */
  public getUserConnectionCount(userId: string): number {
    const userSockets = this.userConnections.get(userId);
    return userSockets
      ? userSockets.filter((ws) => ws.readyState === WebSocket.OPEN).length
      : 0;
  }

  /**
   * Get total number of active connections
   * @returns Total number of connections
   */
  public getTotalConnectionCount(): number {
    let total = 0;
    this.userConnections.forEach((sockets) => {
      total += sockets.filter((ws) => ws.readyState === WebSocket.OPEN).length;
    });
    return total;
  }

  /**
   * Close all connections for a user
   * @param userId - User ID
   */
  public disconnectUser(userId: string): void {
    const userSockets = this.userConnections.get(userId);
    if (userSockets) {
      userSockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(WEBSOCKET.NORMAL_CLOSURE, "Disconnected by server");
        }
      });
      this.userConnections.delete(userId);
      logger.info(`Disconnected all connections for user ${userId}`);
    }
  }
}
