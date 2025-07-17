const { createDefaultPreset, pathsToModuleNameMapper } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;
const { compilerOptions } = require("./tsconfig");

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
