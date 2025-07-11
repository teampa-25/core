import { Router } from "express";
import authRoute from "@/routes/auth"
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
  res.send('API is running (dev mode) \n visit http://localhost:3000/api/docs for Swagger Documentation');
});

export default router
