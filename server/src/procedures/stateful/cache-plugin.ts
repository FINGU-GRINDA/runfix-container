import Elysia from "elysia";
import { env } from "../../config";
import { redis } from "../../data/redis";

export const cachePlugin = new Elysia({
	name: "cache-plugin",
	detail: {
		description: "Cache plugin",
		summary: "Cache plugin",
	},
})
	.resolve(async (_ctx) => {
		return {
			cache: {
				get: async (params: { key: string }) => {
					const cachedValue = await redis.get(params.key);

					if (!cachedValue) {
						return null;
					}

					return JSON.parse(cachedValue);
				},
				set: async (params: {
					key: string;
					value: object | string | number;
					ttl?: number;
				}) => {
					await redis.set(params.key, JSON.stringify(params.value), {
						EX: params.ttl || env.CACHE_TTL,
					});
				},
				delete: async (params: { key: string }) => {
					const keys = await redis.keys(params.key);
					const deletePromises = keys.map((key) => redis.del(key));
					await Promise.all(deletePromises);
				},
			},
		};
	})
	.as("plugin");
