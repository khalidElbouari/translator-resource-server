import { BadRequestError } from "../../utils/errors.js";

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.validatedBody = schema.parse(req.body || {});
    next();
  } catch (err) {
    const first = err?.issues?.[0];
    const message = first?.message || "Invalid request body";
    next(new BadRequestError(message, { issues: err?.issues }));
  }
};
