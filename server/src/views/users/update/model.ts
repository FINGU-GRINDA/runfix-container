import { type Static, t } from "elysia";
import { UserPlain } from "../../../../prisma/schema/prismabox/User";

export const UpdateUser = t.Pick(UserPlain, ["firstName", "lastName"]);
export type UpdateUser = Static<typeof UpdateUser>;
