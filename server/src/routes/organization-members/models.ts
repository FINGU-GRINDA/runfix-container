import { t } from "elysia";
import { OrganizationMemberPlain } from "../../../prisma/prismabox/OrganizationMember";

export const UpdateOrganizationMemberSchema = t.Partial(
  OrganizationMemberPlain,
  t.Pick(OrganizationMemberPlain, ["role"])
);
