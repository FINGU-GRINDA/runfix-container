import Elysia, { t } from "elysia";
import { authenticateUser } from "../../plugins/authentication";
import { HttpError } from "elysia-http-error";
import { prisma } from "../../deps/prisma";
import { OrganizationMemberPlain } from "../../../prisma/prismabox/OrganizationMember";
import { OrganizationMemberRole, UserRole } from "@prisma/client";
import { UpdateOrganizationMemberSchema } from "./models";

export const organizationMemberRouter = new Elysia({
  prefix: "/organization-members",
  tags: ["organization-members"],
})
  .use(authenticateUser)
  .get(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbOrganizationMembers = await prisma.organizationMember.findMany({
        where: {
          organizationId: ctx.query.organizationId,
        },
      });

      return dbOrganizationMembers;
    },
    {
      query: t.Object({
        organizationId: t.String(),
      }),
      response: t.Array(OrganizationMemberPlain),
      detail: "Get all organization members",
    }
  )
  .delete(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbUserOrganizationMember = await prisma.$transaction(async (tx) => {
        // will check user organization role
        const isAppAdmin = ctx.user.role === UserRole.ADMIN;

        if (!isAppAdmin) {
          const dbUserOrganizationAdminOrOwnerMember =
            await tx.organizationMember.findFirst({
              where: {
                userId: ctx.user.id,
                role: {
                  in: [
                    OrganizationMemberRole.OWNER,
                    OrganizationMemberRole.ADMIN,
                  ],
                },
              },
            });
          if (!dbUserOrganizationAdminOrOwnerMember) {
            throw HttpError.Forbidden(
              "You do not have permission to delete this organization member"
            );
          }
        }

        // delete organization member
        const dbUserOrganizationMember = await tx.organizationMember.delete({
          where: {
            id: ctx.params.id,
          },
        });

        return dbUserOrganizationMember;
      });

      return dbUserOrganizationMember;
    },
    {
      response: t.Nullable(OrganizationMemberPlain),
      detail: "Delete an organization member",
    }
  )
  .patch(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbUserOrganizationMember = await prisma.$transaction(async (tx) => {
        // will check user organization role
        const isAppAdmin = ctx.user.role === UserRole.ADMIN;

        if (!isAppAdmin) {
          const dbUserOrganizationAdminOrOwnerMember =
            await tx.organizationMember.findFirst({
              where: {
                userId: ctx.user.id,
                role: {
                  in: [
                    OrganizationMemberRole.OWNER,
                    OrganizationMemberRole.ADMIN,
                  ],
                },
              },
            });
          if (!dbUserOrganizationAdminOrOwnerMember) {
            throw HttpError.Forbidden(
              "You do not have permission to update this organization member"
            );
          }
        }

        // update organization member
        const dbUserOrganizationMember = await tx.organizationMember.update({
          where: {
            id: ctx.params.id,
          },
          data: ctx.body,
        });

        return dbUserOrganizationMember;
      });

      return dbUserOrganizationMember;
    },
    {
      response: t.Nullable(OrganizationMemberPlain),
      body: UpdateOrganizationMemberSchema,
      detail: "Update an organization member",
    }
  );
