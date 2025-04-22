import Elysia from "elysia";

export const getVersion = async (): Promise<string> => {
	// OPEN package.json and extract the version
	try {
		const packageJson = await Bun.file("./package.json").json();
		return packageJson.version || "1.0.0";
	} catch (error) {
		console.error("Error reading package.json:", error);
		return "1.0.0";
	}
};

export const getVersionPlugin = new Elysia({
	name: "get-version-plugin",
	detail: {
		description: "Get version plugin",
		summary: "Get version plugin",
	},
})
	.resolve(async (_ctx) => {
		return {
			getVersion,
		};
	})
	.as("plugin");
