import { Static, t } from "elysia";
import { Project } from "../../../prisma/prismabox/Project";

export const BaseProject = t.Pick(Project, [
  "id",
  "createdAt",
  "updatedAt",
  "name",
  "description",
  "organizationId",
]);
export type BaseProject = Static<typeof BaseProject>;

export const CreateProject = t.Pick(Project, [
  "name",
  "description",
  "organizationId",
]);
export type CreateProject = Static<typeof CreateProject>;

export const UpdateProject = t.Partial(
  t.Pick(Project, ["name", "description"])
);
export type UpdateProject = Static<typeof UpdateProject>;
