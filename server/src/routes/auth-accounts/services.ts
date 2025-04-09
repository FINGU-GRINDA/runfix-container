import { prisma } from "../../deps/prisma";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/server";
import { redis } from "../../deps/redis";

export const getUserPasskeys = async (params: { userId: string }) => {
  const dbPasskey = await prisma.passkeyAuth.findMany({
    where: {
      userId: params.userId,
    },
  });

  return dbPasskey;
};

export const getUser = async (params: { userId: string }) => {
  const dbUser = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  return dbUser;
};

export const createTemporaryUserSessionId = async (params: {
  expireDurationSecond: number;
}): Promise<string> => {
  const newId = crypto.randomUUID();

  return newId;
};

export const tempSaveUserSessionAndOptions = async (params: {
  userSessionId: string;
  passkeyOption: PublicKeyCredentialCreationOptionsJSON;
}) => {
  // save session and options
  return await redis.set(
    `temp-session-options:${params.userSessionId}`,
    JSON.stringify(params.passkeyOption),
    { EX: 300 }
  );
};

export const getTempSessionOptions = async (params: {
  userSessionId: string;
}): Promise<PublicKeyCredentialCreationOptionsJSON | null> => {
  const options = await redis.get(
    `temp-session-options:${params.userSessionId}`
  );
  if (!options) {
    return null;
  }

  return JSON.parse(options);
};
