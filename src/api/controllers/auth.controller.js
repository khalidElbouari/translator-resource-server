import { upsertGoogleUser, verifyGoogleToken } from "../../core/services/auth.service.js";

export const authenticateWithGoogle = async (req, res, next) => {
  try {
    const token = req.body.token || req.body.idToken;
    const profile = await verifyGoogleToken(token);
    const user = await upsertGoogleUser(profile);

    res.json({
      data: {
        userId: user.userId,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
        authProvider: user.authProvider,
        lastLoginAt: user.lastLoginAt
      }
    });
  } catch (err) {
    next(err);
  }
};
