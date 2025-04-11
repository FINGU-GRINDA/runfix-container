import Elysia, { t } from "elysia";
import { authenticateUser } from "../../plugins/authentication";
import { HttpError } from "elysia-http-error";
import {
  BaseOrganization,
  CreateOrganization,
  UpdateOrganization,
} from "./models";
import { prisma } from "../../deps/prisma";
import { OrganizationMemberRole } from "@prisma/client";

export const organizationRouter = new Elysia({
  prefix: "/organizations",
  tags: ["organizations"],
})
  .use(authenticateUser)
  .get(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbOrganizations = await prisma.organization.findMany({
        where: {
          OrganizationMembers: {
            some: {
              userId: ctx.user.id,
            },
          },
        },
      });

      return dbOrganizations;
    },
    {
      query: t.Object({
        userId: t.String(),
      }),
      response: t.Array(BaseOrganization),
      detail: "Get all organizations that the user is a member of",
    }
  )
  .get(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbOrganization = await prisma.organization.findUnique({
        where: {
          id: ctx.params.id,
          OrganizationMembers: {
            some: {
              userId: ctx.user.id,
            },
          },
        },
      });

      return dbOrganization;
    },
    { response: t.Nullable(BaseOrganization), detail: "Get an organization" }
  )
  .post(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbOrganization = await prisma.organization.create({
        data: {
          name: ctx.body.name,
          description: ctx.body.description,
          OrganizationMembers: {
            create: {
              role: OrganizationMemberRole.OWNER,
              userId: ctx.user.id,
            },
          },
        },
      });

      return dbOrganization;
    },
    {
      response: BaseOrganization,
      body: CreateOrganization,
      detail: "Create a new organization",
    }
  )
  .patch(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbOrganization = await prisma.organization.update({
        where: {
          id: ctx.params.id,
          OrganizationMembers: {
            some: {
              userId: ctx.user.id,
            },
          },
        },
        data: ctx.body,
      });

      return dbOrganization;
    },
    {
      response: BaseOrganization,
      body: UpdateOrganization,
      detail: "Update an organization",
    }
  )
  .delete(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbOrganization = await prisma.organization.delete({
        where: {
          id: ctx.params.id,
          OrganizationMembers: {
            some: {
              userId: ctx.user.id,
            },
          },
        },
      });

      return dbOrganization;
    },
    {
      response: BaseOrganization,
      detail: "Delete an organization",
    }
  );
