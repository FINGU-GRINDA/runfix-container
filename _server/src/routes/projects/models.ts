import { Static, t } from "elysia";
import { Project, ProjectPlain } from "../../../prisma/prismabox/Project";

export const BaseProject = t.Pick(ProjectPlain, [
  "id",
  "createdAt",
  "updatedAt",
  "name",
  "description",
  "organizationId",
]);
export type BaseProject = Static<typeof BaseProject>;

export const CreateProject = t.Pick(ProjectPlain, [
  "name",
  "description",
  "organizationId",
]);
export type CreateProject = Static<typeof CreateProject>;

export const UpdateProject = t.Partial(
  t.Pick(ProjectPlain, ["name", "description"])
);
export type UpdateProject = Static<typeof UpdateProject>;
