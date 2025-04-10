import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrganizationMemberRole = t.Union([
  t.Literal("ADMIN"),
  t.Literal("MEMBER"),
  t.Literal("OWNER"),
]);
