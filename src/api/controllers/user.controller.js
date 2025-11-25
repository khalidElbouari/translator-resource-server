import { getUserStatus } from "../../core/services/user.service.js";
import { BadRequestError } from "../../utils/errors.js";

export const getStatus = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestError('Missing "userId" for status lookup.');
    }
    const status = await getUserStatus(userId);
    res.json({ data: status });
  } catch (err) {
    next(err);
  }
};
