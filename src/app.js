import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRoutes from "./api/routes/index.js";
import { env } from "./config/env.js";
import { requestLogger } from "./core/middlewares/requestLogger.js";
import { rateLimiter } from "./core/middlewares/rateLimiter.js";
import { notFoundHandler } from "./core/middlewares/notFound.js";
import { errorHandler } from "./core/middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import fs from "fs";
import path from "path";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());

  const allowAllOrigins = env.corsOrigins.includes("*");
  app.use(
    cors({
      origin: allowAllOrigins ? true : env.corsOrigins,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  // OpenAPI / Swagger setup
  const openapiPath = path.resolve(process.cwd(), "docs-openapi.yaml");
  let openapiSpec;
  try {
    const openapiYAML = fs.readFileSync(openapiPath, "utf8");
    openapiSpec = YAML.parse(openapiYAML);
  } catch (err) {
    // Fallback minimal spec if file missing to keep /api-docs alive
    openapiSpec = {
      openapi: "3.0.3",
      info: { title: "Translator Server API", version: "1.0.0" }
    };
  }

  app.get("/openapi.json", (req, res) => {
    res.json(openapiSpec);
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec, { explorer: true }));

  app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.use("/api", rateLimiter, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
