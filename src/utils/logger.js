import { createLogger, format, transports } from "winston";
import { env } from "../config/env.js";

const { combine, timestamp, errors, json, splat } = format;

const logger = createLogger({
  level: env.logLevel,
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  defaultMeta: { service: "translator-server" },
  transports: [new transports.Console()]
});

export default logger;
