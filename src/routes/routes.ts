import { Router } from "express";
import authRoute from "@/routes/auth";
import healthRoute from "@/routes/health";
import adminRoute from "@/routes/admin";
import datasetRoute from "@/routes/dataset";
import inferenceRoute from "@/routes/inference";
import websocketRoute from "@/routes/websocket";
import userRoute from "@/routes/user";
import docsRoute from "@/routes/docs";

const router = Router();

/**
 * Array object that define all api routes
 */
const routes: Array<{ path: string; route: any }> = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/inference",
    route: inferenceRoute,
  },
  {
    path: "/dataset",
    route: datasetRoute,
  },
  {
    path: "/docs",
    route: docsRoute,
  },
  {
    path: "/health",
    route: healthRoute,
  },
  {
    path: "/websocket",
    route: websocketRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
