import config from "../config/config";

export const swaggerDef = {
  myapi: "3.0.0",
  info: {
    title: "My API",
    version: config.apiVersion || "1.0.0",
    description: "API documentation",
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
    },
  ],
  tags: [
    {
      name: "Test",
      description: "Test route",
    },
  ],
};

export default swaggerDef;
