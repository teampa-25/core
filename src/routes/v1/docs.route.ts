import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerDef } from "../../docs/swagger";

const router = Router();

const specs = swaggerJsDoc({
  definition: swaggerDef,
  apis: ["src/routes/v1/*.ts", "src/controllers/*.ts"],
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Documentation",
  }),
);

export default router;
