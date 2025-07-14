import { Router } from "express";
import authRoute from "@/routes/auth";
import healthRoute from "@/routes/health";
import adminRoute from "@/routes/admin";
import datasetRoute from "@/routes/dataset";
// import docsRoute from "@/routes/docs"

const router = Router();

const defaultRoutes: Array<{ path: string; route: any }> = [
  {
    path: "/auth",
    route: authRoute,
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
    path: "/datasets",
    route: datasetRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
