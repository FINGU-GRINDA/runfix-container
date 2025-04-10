import Elysia, { t } from "elysia";
import { authenticateUser } from "../../plugins/authentication";
import { prisma } from "../../deps/prisma";
import { HttpError } from "elysia-http-error";
import jwt from "@elysiajs/jwt";
import { env } from "../../../config";
import { ApiKey, ApiKeyPlain } from "../../../prisma/prismabox/ApiKey";
import { OrganizationMemberRole } from "@prisma/client";
import { parseValue } from "../../utils/parse-value";

export const apiKeyRouter = new Elysia({
  prefix: "/api-keys",
  tags: ["api-keys"],
})
  .use(authenticateUser)
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
      });

      // Transform the response to match the expected schema
      // Convert bigint usageCount to number
      return dbApiKeys.map((apiKey) => {
        return parseValue(ApiKeyPlain, apiKey);
      });
    },
    {
      query: t.Object({
        projectId: t.String(),
      }),
      response: t.Array(ApiKeyPlain),
      detail: "Get all API keys for a specific organization",
    }
  )
  .post(
    "",
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
      });

      // Transform the response to match the expected schema
      return parseValue(ApiKeyPlain, dbApiKey);
    },
    {
      response: ApiKeyPlain,
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
      });

      // Transform the response to match the expected schema
      return parseValue(ApiKeyPlain, dbApiKey);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: ApiKeyPlain,
    }
  )
  .get(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Unauthorized");
      }

      const dbApiKey = await prisma.apiKey.findUnique({
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
      });

      // Transform the response to match the expected schema
      return parseValue(ApiKeyPlain, dbApiKey);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: ApiKeyPlain,
      detail: "Get API key information by id",
    }
  );
