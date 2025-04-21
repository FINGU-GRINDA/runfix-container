import { env } from "../../config";
import { redis } from "../deps/redis";

export const getCache = async (params: { key: string }) => {
  const cachedValue = await redis.get(params.key);

  if (!cachedValue) {
    return null;
  }

  return JSON.parse(cachedValue);
};
export const setCache = async (params: {
  key: string;
  value: string;
  ttl?: number;
}) => {
  await redis.set(params.key, params.value, {
    EX: params.ttl || env.CACHE_TTL,
  });
};

export const deleteCache = async (params: { key: string }) => {
  await redis.del(params.key);
};
