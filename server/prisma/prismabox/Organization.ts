import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrganizationPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  name: t.String(),
  description: t.String(),
});

export const OrganizationRelations = t.Object({
  OrganizationMembers: t.Array(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      role: t.Union([
        t.Literal("ADMIN"),
        t.Literal("MEMBER"),
        t.Literal("OWNER"),
      ]),
      userId: __nullable__(t.String()),
      organizationId: __nullable__(t.String()),
    }),
    { additionalProperties: true },
  ),
  Projects: t.Array(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      name: t.String(),
      description: t.String(),
      organizationId: __nullable__(t.String()),
    }),
    { additionalProperties: true },
  ),
});

export const OrganizationPlainInputCreate = t.Object({
  name: t.String(),
  description: t.String(),
});

export const OrganizationPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
  description: t.Optional(t.String()),
});

export const OrganizationRelationsInputCreate = t.Object({
  OrganizationMembers: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
  Projects: t.Optional(
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

export const OrganizationRelationsInputUpdate = t.Partial(
  t.Object({
    OrganizationMembers: t.Partial(
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
    Projects: t.Partial(
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

export const OrganizationWhere = t.Partial(
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
        },
        { additionalProperties: true },
      ),
    { $id: "Organization" },
  ),
);

export const OrganizationWhereUnique = t.Recursive(
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
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Organization" },
);

export const OrganizationSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    name: t.Boolean(),
    description: t.Boolean(),
    OrganizationMembers: t.Boolean(),
    Projects: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const OrganizationInclude = t.Partial(
  t.Object({
    OrganizationMembers: t.Boolean(),
    Projects: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const OrganizationOrderBy = t.Partial(
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
  }),
);

export const Organization = t.Composite([
  OrganizationPlain,
  OrganizationRelations,
]);

export const OrganizationInputCreate = t.Composite([
  OrganizationPlainInputCreate,
  OrganizationRelationsInputCreate,
]);

export const OrganizationInputUpdate = t.Composite([
  OrganizationPlainInputUpdate,
  OrganizationRelationsInputUpdate,
]);
