import { Router } from "express";
import authRoute from "@/routes/auth";
import healthRoute from "@/routes/health";
import adminRoute from "@/routes/admin";
import datasetRoute from "@/routes/dataset";
import userRoute from "@/routes/user";
//import inferenceRoute from "@/routes/inference";
//import resultRoute from "@/routes/result";
// import docsRoute from "@/routes/docs"

const router = Router();

const defaultRoutes: Array<{ path: string; route: any }> = [
  {
    path: "/auth",
    route: authRoute,
  },
  // {
  //   path: "/inference",
  //   route: inferenceRoute,
  // },
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
    path: "/user",
    route: userRoute,
  },
  /* {
    path: "/result",
    route: resultRoute,
  }, */
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
