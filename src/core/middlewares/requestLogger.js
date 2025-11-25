import logger from "../../utils/logger.js";

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("HTTP %s %s %d %dms", req.method, req.originalUrl, res.statusCode, duration, {
      requestId: req.headers["x-request-id"],
      userAgent: req.headers["user-agent"]
    });
  });
  next();
};
