import Elysia from "elysia";

export const getExpTimestampPlugin = new Elysia({
	name: "get-exp-timestamp-plugin",
	detail: {
		description: "Get expiration timestamp plugin",
		summary: "Get expiration timestamp plugin",
	},
})
	.resolve(async (_ctx) => {
		return {
			getExpTimestamp: (params: { seconds: number }) => {
				const currentTimeMillis = Date.now();
				const secondsIntoMillis = params.seconds * 1000;
				const expirationTimeMillis = currentTimeMillis + secondsIntoMillis;

				return Math.floor(expirationTimeMillis / 1000);
			},
		};
	})
	.as("plugin");
