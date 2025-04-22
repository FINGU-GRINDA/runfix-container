import Elysia from "elysia";

export const hashPlugin = new Elysia({
	name: "hash-plugin",
	detail: {
		description: "Hash plugin",
		summary: "Hash plugin",
	},
})
	.resolve(async () => {
		return {
			hash: {
				hash: async (params: { value: string }) => {
					const hashedValue = await Bun.password.hash(params.value, "bcrypt");
					return hashedValue;
				},
				isMatch: async (params: { value: string; hashedValue: string }) => {
					const isMatch = await Bun.password.verify(
						params.value,
						params.hashedValue,
					);
					return isMatch;
				},
			},
		};
	})
	.as("plugin");
