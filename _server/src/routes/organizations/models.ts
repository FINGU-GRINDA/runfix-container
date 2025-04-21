import { Static, t } from "elysia";
import { OrganizationPlain } from "../../../prisma/prismabox/Organization";

export const BaseOrganization = t.Pick(OrganizationPlain, [
  "id",
  "createdAt",
  "updatedAt",
  "name",
  "description",
]);
export type BaseOrganization = Static<typeof BaseOrganization>;

export const CreateOrganization = t.Pick(OrganizationPlain, [
  "name",
  "description",
]);
export type CreateOrganization = Static<typeof CreateOrganization>;

export const UpdateOrganization = t.Partial(
  t.Pick(OrganizationPlain, ["name", "description"])
);
export type UpdateOrganization = Static<typeof UpdateOrganization>;
