import Elysia, { t } from "elysia";
import { authenticateUser } from "../../plugins/authentication";
import { prisma } from "../../deps/prisma";
import { HttpError } from "elysia-http-error";
import jwt from "@elysiajs/jwt";
import { env } from "../../../config";
import { ApiKey } from "../../../prisma/prismabox/ApiKey";
import { OrganizationMemberRole } from "@prisma/client";

export const apiKeyRouter = new Elysia({
  prefix: "/api-keys",
  tags: ["api-keys"],
})
  .use(authenticateUser)
  .model({
    ApiKey: ApiKey,
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

      // if user doesn't belong to organization that own the project, throw error
      if (!ctx.query.projectId) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbApiKeys = await prisma.apiKey.findMany({
        where: {
          projectId: ctx.query.projectId,
          // user must be a part of the organization where the project is owned
          Project: {
            Organization: {
              OrganizationMembers: {
                some: {
                  userId: ctx.user.id,
                },
              },
            },
          },
        },
        include: {
          Project: true,
        },
      });

      // Transform the response to match the expected schema
      // Convert bigint usageCount to number
      return dbApiKeys.map((apiKey) => ({
        ...apiKey,
        usageCount: Number(apiKey.usageCount),
      }));
    },
    {
      query: t.Optional(
        t.Object({
          projectId: t.String(),
        })
      ),
      response: t.Array(ApiKey),
      detail: "Get all API keys for a specific organization",
    }
  )
  .post(
    "/create-api-key",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbProject = await prisma.project.findFirst({
        where: {
          id: ctx.body.projectId,
          Organization: {
            OrganizationMembers: {
              some: {
                userId: ctx.user.id,
              },
            },
          },
        },
      });

      const newApiKeyPayload = JSON.stringify(dbProject);

      const newKey = await ctx.jwt.sign({
        iss: env.ISSUER,
        sub: newApiKeyPayload,
      });

      const dbApiKey = await prisma.apiKey.create({
        data: {
          projectId: ctx.body.projectId,
          key: newKey,
        },
        include: {
          Project: true,
        },
      });

      // Transform the response to match the expected schema
      return {
        ...dbApiKey,
        usageCount: Number(dbApiKey.usageCount),
      };
    },
    {
      response: "ApiKey",
      body: t.Object({
        projectId: t.String(),
      }),
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
          Project: {
            Organization: {
              OrganizationMembers: {
                some: {
                  userId: ctx.user.id,
                  role: {
                    in: [
                      OrganizationMemberRole.ADMIN,
                      OrganizationMemberRole.OWNER,
                      OrganizationMemberRole.MEMBER,
                    ],
                  },
                },
              },
            },
          },
        },
        include: {
          Project: true,
        },
      });

      return {
        ...dbApiKey,
        usageCount: Number(dbApiKey.usageCount),
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: "ApiKey",
    }
  );
