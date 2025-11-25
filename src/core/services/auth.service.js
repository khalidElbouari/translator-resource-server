import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env.js";
import logger from "../../utils/logger.js";
import { BadRequestError, ServiceUnavailableError } from "../../utils/errors.js";
import { UserModel } from "../../domain/models/user.model.js";

const googleClient = new OAuth2Client(env.googleClientId);

const ensureMongoConnected = () => {
  if (UserModel.db?.readyState !== 1) {
    throw new ServiceUnavailableError("Database is not connected.");
  }
};

export const verifyGoogleToken = async (idToken) => {
  if (!idToken) {
    throw new BadRequestError('Missing "token" in request body.');
  }

  if (!env.googleClientId) {
    throw new ServiceUnavailableError("Google OAuth client ID is not configured.");
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.googleClientId
    });

    const payload = ticket.getPayload();
    if (!payload?.sub) {
      throw new BadRequestError("Invalid Google token payload.");
    }

    return {
      userId: payload.sub,
      email: payload.email,
      displayName: payload.name,
      avatarUrl: payload.picture,
      emailVerified: payload.email_verified
    };
  } catch (err) {
    logger.warn("Google token verification failed", { error: err?.message });
    throw new BadRequestError("Invalid Google token.", { reason: err?.message });
  }
};

export const upsertGoogleUser = async (profile) => {
  ensureMongoConnected();
  const now = new Date();

  const update = {
    email: profile.email,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    authProvider: "google",
    lastLoginAt: now
  };

  const user = await UserModel.findOneAndUpdate(
    { userId: profile.userId },
    { $set: update, $setOnInsert: { plan: "free", usage: {}, createdAt: now } },
    { new: true, upsert: true }
  );

  return user;
};
