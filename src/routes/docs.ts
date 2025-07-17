import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerDef } from "@/common/utils/swagger";

const router = Router();

/**
 * @description: Swagger-jsdoc build
 */

const specs = swaggerJsDoc({
  definition: swaggerDef,
  apis: ["@/routes/**/*.ts", "@/controllers/**/*.ts"],
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  }),
);

export default router;
