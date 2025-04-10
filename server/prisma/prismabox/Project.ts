import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProjectPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  name: t.String(),
  description: t.String(),
  organizationId: __nullable__(t.String()),
});

export const ProjectRelations = t.Object({
  Organization: __nullable__(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      name: t.String(),
      description: t.String(),
    }),
  ),
  ApiKeys: t.Array(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      key: t.String(),
      usageCount: t.Integer(),
      projectId: __nullable__(t.String()),
    }),
    { additionalProperties: true },
  ),
  Translations: t.Array(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      enText: __nullable__(t.String()),
      koText: __nullable__(t.String()),
      jaText: __nullable__(t.String()),
      zhText: __nullable__(t.String()),
      uzText: __nullable__(t.String()),
      viText: __nullable__(t.String()),
      ruText: __nullable__(t.String()),
      kkText: __nullable__(t.String()),
      mnText: __nullable__(t.String()),
      thText: __nullable__(t.String()),
      idText: __nullable__(t.String()),
      projectId: __nullable__(t.String()),
    }),
    { additionalProperties: true },
  ),
});

export const ProjectPlainInputCreate = t.Object({
  name: t.String(),
  description: t.String(),
});

export const ProjectPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
  description: t.Optional(t.String()),
});

export const ProjectRelationsInputCreate = t.Object({
  Organization: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
  ApiKeys: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
  Translations: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
});

export const ProjectRelationsInputUpdate = t.Partial(
  t.Object({
    Organization: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
    ApiKeys: t.Partial(
      t.Object({
        connect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
        disconnect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
      }),
    ),
    Translations: t.Partial(
      t.Object({
        connect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
        disconnect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
      }),
    ),
  }),
);

export const ProjectWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          name: t.String(),
          description: t.String(),
          organizationId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "Project" },
  ),
);

export const ProjectWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: true }),
          { additionalProperties: true },
        ),
        t.Union([t.Object({ id: t.String() })], { additionalProperties: true }),
        t.Partial(
          t.Object({
            AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
            NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
            OR: t.Array(Self, { additionalProperties: true }),
          }),
          { additionalProperties: true },
        ),
        t.Partial(
          t.Object({
            id: t.String(),
            createdAt: t.Date(),
            updatedAt: t.Date(),
            name: t.String(),
            description: t.String(),
            organizationId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Project" },
);

export const ProjectSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    name: t.Boolean(),
    description: t.Boolean(),
    Organization: t.Boolean(),
    organizationId: t.Boolean(),
    ApiKeys: t.Boolean(),
    Translations: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const ProjectInclude = t.Partial(
  t.Object({
    Organization: t.Boolean(),
    ApiKeys: t.Boolean(),
    Translations: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const ProjectOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    name: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    description: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    organizationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Project = t.Composite([ProjectPlain, ProjectRelations]);

export const ProjectInputCreate = t.Composite([
  ProjectPlainInputCreate,
  ProjectRelationsInputCreate,
]);

export const ProjectInputUpdate = t.Composite([
  ProjectPlainInputUpdate,
  ProjectRelationsInputUpdate,
]);
