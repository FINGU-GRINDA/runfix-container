import { Static, t } from "elysia";
import { Organization } from "../../../prisma/prismabox/Organization";

export const BaseOrganization = t.Pick(Organization, [
  "id",
  "createdAt",
  "updatedAt",
  "name",
  "description",
]);
export type BaseOrganization = Static<typeof BaseOrganization>;

export const CreateOrganization = t.Pick(Organization, ["name", "description"]);
export type CreateOrganization = Static<typeof CreateOrganization>;

export const UpdateOrganization = t.Partial(
  t.Pick(Organization, ["name", "description"])
);
export type UpdateOrganization = Static<typeof UpdateOrganization>;
