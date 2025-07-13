import { Router } from "express";
import authRoute from "@/routes/auth.route"

// import docsRoute from "@/routes/docs"
// import healthRoute from "@/routes/health"

const router = Router()

const defaultRoutes: Array<{ path: string, route: any }> = [
  {
    path: "/auth",
    route: authRoute
  },
  // {
  //   path: "/docs",
  //   route: docsRoute
  // },
  // {
  //   path: "/health",
  //   route: healthRoute
  // }
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
})

router.get('/', (_, res) => {
  res.send('<h1>InferNode is running<h1/>');
});

export default router
