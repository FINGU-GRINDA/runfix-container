import Elysia, { t } from "elysia";
import { authenticateUser } from "../../plugins/authentication";
import { prisma } from "../../deps/prisma";
import { HttpError } from "elysia-http-error";
import { apiKeySchema } from "./models";
import jwt from "@elysiajs/jwt";
import { env } from "../../../config";

export const apiKeyRouter = new Elysia({
  prefix: "/api-keys",
  tags: ["api-keys"],
})
  .use(authenticateUser)
  .model({
    ApiKey: apiKeySchema,
  })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .get(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbApiKeys = await prisma.apiKey.findMany({
        where: {
          userId: ctx.user.id,
        },
      });

      return dbApiKeys.map((apiKey) => ({
        id: apiKey.id,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
        key: apiKey.key,
        usageCount: Number(apiKey.usageCount),
        userId: apiKey.userId,
      }));
    },
    {
      response: t.Array(apiKeySchema),
    }
  )
  .post(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
      });

      const newApiKeyPayload = JSON.stringify(dbUser);

      const newKey = await ctx.jwt.sign({
        iss: env.ISSUER,
        sub: newApiKeyPayload,
      });

      const dbApiKey = await prisma.apiKey.create({
        data: {
          userId: ctx.user.id,
          key: newKey,
        },
      });

      return {
        id: dbApiKey.id,
        createdAt: dbApiKey.createdAt,
        updatedAt: dbApiKey.updatedAt,
        key: dbApiKey.key,
        usageCount: Number(dbApiKey.usageCount),
        userId: dbApiKey.userId,
      };
    },
    {
      response: "ApiKey",
    }
  )
  .delete(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbApiKey = await prisma.apiKey.delete({
        where: {
          id: ctx.params.id,
        },
      });

      return {
        id: dbApiKey.id,
        createdAt: dbApiKey.createdAt,
        updatedAt: dbApiKey.updatedAt,
        key: dbApiKey.key,
        usageCount: Number(dbApiKey.usageCount),
        userId: dbApiKey.userId,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: "ApiKey",
    }
  );
