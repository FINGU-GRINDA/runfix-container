import Elysia, { Context } from "elysia";
import { redis } from "../deps/redis";

export const getCache = async (params: { key: string }) => {
  const cachedValue = await redis.get(params.key);

  if (!cachedValue) {
    return null;
  }

  return JSON.parse(cachedValue);
};
export const setCache = async (params: { key: string; value: any }) => {
  await redis.set(params.key, JSON.stringify(params.value));
};

export const deleteCache = async (params: { key: string }) => {
  await redis.del(params.key);
};
