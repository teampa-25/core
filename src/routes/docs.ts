import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerDef } from "@/utils/swagger";

const router = Router();

const specs = swaggerJsDoc({
  definition: swaggerDef,
  apis: ["@/routes/**/*.ts"],
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  }),
);

export default router;
