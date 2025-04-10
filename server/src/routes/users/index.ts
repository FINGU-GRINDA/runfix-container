import { Elysia, t } from "elysia";
import { CreateUser, UpdateUser, BaseUser } from "./models";
import { HttpError } from "elysia-http-error";
import { authenticateUser } from "../../plugins/authentication";
import { UserRole } from "@prisma/client";
import { prisma } from "../../deps/prisma";

export const userRouter = new Elysia({
  prefix: "/users",
  tags: ["users"],
})
  .use(authenticateUser)
  .get(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      if (ctx.user.role !== UserRole.ADMIN) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbUsers = await prisma.user.findMany({
        take: ctx.query.take,
        skip: ctx.query.skip,
      });

      // Transform the response to convert bigint values to numbers
      return dbUsers;
    },
    {
      query: t.Optional(
        t.Object({
          take: t.Optional(t.Number({ default: 10 })),
          skip: t.Optional(t.Number({ default: 0 })),
        })
      ),
      response: t.Array(BaseUser),
      detail: "Get all users",
    }
  )
  .get(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          id: ctx.params.id,
        },
      });

      return dbUser;
    },
    {
      response: t.Nullable(BaseUser),
      params: t.Object({
        id: t.String(),
      }),
      detail: "Get a user by ID",
    }
  )
  .patch(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      // can only edit if user is admin or owner
      if (ctx.user.role !== UserRole.ADMIN || ctx.user.id !== ctx.params.id) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbUser = await prisma.user.update({
        where: {
          id: ctx.params.id,
        },
        data: ctx.body,
      });

      return dbUser;
    },
    {
      response: t.Nullable(BaseUser),
      body: UpdateUser,
      params: t.Object({
        id: t.String(),
      }),
      detail: "Update a user by ID",
    }
  )
  .delete(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      // can only delete if user is admin or owner
      if (ctx.user.role !== UserRole.ADMIN || ctx.user.id !== ctx.params.id) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbUser = await prisma.user.delete({
        where: {
          id: ctx.params.id,
        },
      });

      return dbUser;
    },
    {
      response: t.Nullable(BaseUser),
      params: t.Object({
        id: t.String(),
      }),
      detail: "Delete a user by ID",
    }
  );
