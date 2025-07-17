import enviroment from "@/config/enviroment";

export const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "InferNode API",
    version: "v1",
    description:
      "A REST API built with Node.js, TypeScript, Express, and PostgreSQL",
  },
  servers: [
    {
      url: `http://localhost:${enviroment.apiPort}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export default swaggerDef;
