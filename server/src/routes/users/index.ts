import { Elysia, t } from "elysia";
import { createUserSchema, updateUserSchema, userSchema } from "./models";
import { HttpError } from "elysia-http-error";
import { authenticateUser } from "../../plugins/authentication";

export const userRouter = new Elysia({
  prefix: "/users",
  tags: ["users"],
})
  .use(authenticateUser)
  .model({
    User: userSchema,
    CreateUser: createUserSchema,
    UpdateUser: updateUserSchema,
  })
  .get(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in as admin");
      }

      throw HttpError.NotImplemented();
    },
    {
      response: t.Array(userSchema),
    }
  )
  .get(
    "/:id",
    async () => {
      throw HttpError.NotImplemented();
    },
    {
      response: "User",
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .patch(
    "/:id",
    async () => {
      throw HttpError.NotImplemented();
    },
    {
      response: "User",
      body: updateUserSchema,
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/:id",
    async () => {
      throw HttpError.NotImplemented();
    },
    {
      response: "User",
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "",
    async () => {
      throw HttpError.NotImplemented();
    },
    {
      body: "CreateUser",
      response: "User",
    }
  );
