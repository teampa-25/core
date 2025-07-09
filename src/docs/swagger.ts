import config from "../config/config";

export const swaggerDef = {
  myapi: "3.0.0",
  info: {
    title: "InferNode API",
    version: config.apiVersion || "v1",
    description:
      "A REST API built with Node.js, TypeScript, Express, and PostgreSQL",
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
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
  tags: [
    {
      name: "Test",
      description: "Test route",
    },
  ],
};

export default swaggerDef;
