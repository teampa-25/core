import { logger } from "@/config/logger";
import path from "path";
import YAML from "yamljs";

export const loadYaml = () => {
  let yamlSpecs;
  try {
    const swaggerPath = path.resolve(__dirname, "./index.yaml");
    yamlSpecs = YAML.load(swaggerPath);
  } catch (error) {
    logger.error(`Error loading swagger file: ${error}`);
    yamlSpecs = {
      openapi: "3.0.0",
      info: {
        title: "InferNode API",
        version: "1.0.0",
        description: "API documentation not available",
      },
      paths: {},
    };
  }

  return yamlSpecs;
};
