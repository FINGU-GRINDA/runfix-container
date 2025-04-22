import Elysia from "elysia";
import { prisma } from "../../data/prisma";

export const databasePlugin = new Elysia({
	name: "database-plugin",
	detail: {
		description: "Database plugin",
		summary: "Database plugin",
	},
})
	.resolve(async (ctx) => {
		return {
			db: prisma,
		};
	})
	.as("plugin");
