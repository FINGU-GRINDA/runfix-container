import { Static, t } from "elysia";
import { User, UserPlain } from "../../../prisma/prismabox/User";

export const BaseUser = t.Pick(UserPlain, [
  "id",
  "createdAt",
  "updatedAt",
  "firstName",
  "lastName",
  "profilePicture",
  "role",
]);
export type BaseUser = Static<typeof BaseUser>;

export const CreateUser = t.Pick(UserPlain, ["firstName", "lastName"]);
export type CreateUser = Static<typeof CreateUser>;

export const UpdateUser = t.Pick(UserPlain, ["firstName", "lastName"]);
export type UpdateUser = Static<typeof UpdateUser>;
