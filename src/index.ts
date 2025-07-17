import httpServer from "./app";
import enviroment from "@/config/enviroment";
import { logger } from "@/config/logger";

// decopuled app instance and server listen
//    -> easly export app so that we can use it with jest
// const httpServer = createServer(app);

httpServer.listen(enviroment.apiPort, () => {
  logger.info(`Server running on port ${enviroment.apiPort}`);
  logger.info(
    `API Documentation: http://localhost:${enviroment.apiPort}/api/docs`,
  );
  logger.info(
    `Health Check: http://localhost:${enviroment.apiPort}/api/health`,
  );
  logger.info("WebSocket server initialized");
});
