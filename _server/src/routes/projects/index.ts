import Elysia, { t } from "elysia";
import { authenticateUser } from "../../plugins/authentication";
import { HttpError } from "elysia-http-error";
import { prisma } from "../../deps/prisma";
import { BaseProject, CreateProject, UpdateProject } from "./models";

export const projectRouter = new Elysia({
  prefix: "/projects",
  tags: ["projects"],
})
  .use(authenticateUser)
  .get(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbProjects = await prisma.project.findMany({
        where: {
          Organization: {
            OrganizationMembers: {
              some: {
                userId: ctx.user.id,
              },
            },
            id: ctx.query.organizationId,
          },
        },
      });

      return dbProjects;
    },
    {
      query: t.Object({
        organizationId: t.String(),
      }),
      response: t.Array(BaseProject),
      detail: "Get all projects in an organization",
    }
  )
  .get(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbProject = await prisma.project.findUnique({
        where: {
          id: ctx.params.id,
          Organization: {
            OrganizationMembers: {
              some: {
                userId: ctx.user.id,
              },
            },
          },
        },
      });

      return dbProject;
    },
    { response: t.Nullable(BaseProject), detail: "Get a project by ID" }
  )
  .post(
    "",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbProject = await prisma.project.create({
        data: {
          name: ctx.body.name,
          description: ctx.body.description,
          organizationId: ctx.body.organizationId,
        },
      });

      return dbProject;
    },
    {
      body: CreateProject,
      response: BaseProject,
      detail: "Create a new project",
    }
  )
  .delete(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbProject = await prisma.project.delete({
        where: {
          id: ctx.params.id,
          Organization: {
            OrganizationMembers: {
              some: {
                userId: ctx.user.id,
              },
            },
          },
        },
      });

      return dbProject;
    },
    { response: t.Nullable(BaseProject), detail: "Delete a project by ID" }
  )
  .patch(
    "/:id",
    async (ctx) => {
      if (!ctx.user) {
        throw HttpError.Unauthorized("Please sign in");
      }

      const dbProject = await prisma.project.update({
        where: {
          id: ctx.params.id,
          Organization: {
            OrganizationMembers: {
              some: {
                userId: ctx.user.id,
              },
            },
          },
        },
        data: ctx.body,
      });

      return dbProject;
    },
    {
      response: t.Nullable(BaseProject),
      body: UpdateProject,
      detail: "Update a project by ID",
    }
  );
