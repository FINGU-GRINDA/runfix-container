import { t } from "elysia";

export const userSchema = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),

  //   data
  name: t.String(),

  //   relations
  authIds: t.Array(t.String()),
});

export const createUserSchema = t.Object({
  name: t.String(),
});

export const updateUserSchema = t.Object({
  name: t.Optional(t.String()),
});
