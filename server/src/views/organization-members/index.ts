import Elysia from "elysia";
import { deleteOrganizationMemberRouter } from "./delete";
import { readAllOrganizationMembersRouter } from "./read-all";
import { updateOrganizationMemberRouter } from "./update";

export const organizationMemberRouter = new Elysia({
	prefix: "/organization-members",
	tags: ["Organization Members"],
	detail: {
		description: "Manage organization members",
		summary: "Organization member management",
	},
})
	.use(deleteOrganizationMemberRouter)
	.use(readAllOrganizationMembersRouter)
	.use(updateOrganizationMemberRouter);
