import { Static, t } from "elysia";
import { User } from "../../../prisma/prismabox/User";

export const BaseUser = t.Pick(User, [
  "id",
  "createdAt",
  "updatedAt",
  "firstName",
  "lastName",
  "profilePicture",
  "role",
]);
export type BaseUser = Static<typeof BaseUser>;

export const CreateUser = t.Pick(User, ["firstName", "lastName"]);
export type CreateUser = Static<typeof CreateUser>;

export const UpdateUser = t.Pick(User, ["firstName", "lastName"]);
export type UpdateUser = Static<typeof UpdateUser>;
