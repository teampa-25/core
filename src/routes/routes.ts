import { Router } from "express";
import authRoute from "@/routes/auth";
import healthRoute from "@/routes/health";
import adminRoute from "@/routes/admin";
import datasetRoute from "@/routes/dataset";
import inferenceRoute from "@/routes/inference";
import websocketRoute from "@/routes/websocket";
import userRoute from "@/routes/user";
// import docsRoute from "@/routes/docs"

const router = Router();

const defaultRoutes: Array<{ path: string; route: any }> = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/inference",
    route: inferenceRoute,
  },
  {
    path: "/health",
    route: healthRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/dataset",
    route: datasetRoute,
  },
  {
    path: "/websocket",
    route: websocketRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
