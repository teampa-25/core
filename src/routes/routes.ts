import { Router } from "express";
import authRoute from "@/routes/auth"
import healthRoute from "@/routes/health"
import adminRoute from "@/routes/admin"
// import docsRoute from "@/routes/docs"

const router = Router()

const defaultRoutes: Array<{ path: string, route: any }> = [
  {
    path: "/auth",
    route: authRoute
  },
  {
    path: "/health",
    route: healthRoute
  },
  {
    path: "/admin",
    route: adminRoute
  },
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
})

router.get('/', (_, res) => {
  res.send('<h1>InferNode is running<h1/>');
});

export default router
