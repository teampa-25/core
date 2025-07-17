import { loadYaml } from "@/docs/swagget";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

const router = Router();

/**
 * @description: Swagger documentation setup
 */

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(loadYaml(), {
    explorer: true,
  }),
);

export default router;
