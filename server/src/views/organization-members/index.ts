import Elysia from "elysia";
import { deleteRouter } from "./delete";
import { readAllRouter } from "./read-all";
import { updateRouter } from "./update";

export const organizationMemberRouter = new Elysia({
	prefix: "/organization-members",
	tags: ["Organization Members"],
	detail: {
		description: "Manage organization members",
		summary: "Organization member management",
	},
})
	.use(deleteRouter)
	.use(readAllRouter)
	.use(updateRouter);
