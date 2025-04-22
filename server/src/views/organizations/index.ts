import Elysia from "elysia";
import { createOrganizationRouter } from "./create";
import { deleteOrganizationRouter } from "./delete";
import { readOrganizationRouter } from "./read";
import { readAllOrganizationsRouter } from "./read-all";
import { updateOrganizationRouter } from "./update";

export const organizationRouter = new Elysia({
	name: "organizations-router",
	prefix: "/organizations",
	tags: ["Organizations"],
	detail: {
		description: "Organization management",
		summary: "Organization management",
	},
})
	.use(createOrganizationRouter)
	.use(readOrganizationRouter)
	.use(readAllOrganizationsRouter)
	.use(updateOrganizationRouter)
	.use(deleteOrganizationRouter);
