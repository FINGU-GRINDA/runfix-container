import Elysia from "elysia";
import { createProject } from "./create";
import { deleteProject } from "./delete";
import { readProject } from "./read";
import { readAllProjects } from "./read-all";
import { updateProject } from "./update";

export const projectRouter = new Elysia({
	prefix: "/projects",
	tags: ["Projects"],
	detail: {
		description: "Projects",
		summary: "Projects",
	},
})
	.use(createProject)
	.use(readAllProjects)
	.use(readProject)
	.use(updateProject)
	.use(deleteProject);
