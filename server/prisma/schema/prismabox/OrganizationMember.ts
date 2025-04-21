import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrganizationMemberPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  role: t.Union([t.Literal("ADMIN"), t.Literal("MEMBER"), t.Literal("OWNER")]),
  userId: __nullable__(t.String()),
  organizationId: __nullable__(t.String()),
});

export const OrganizationMemberRelations = t.Object({
  User: __nullable__(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      firstName: t.String(),
      lastName: t.String(),
      profilePicture: __nullable__(t.String()),
      role: t.Union([t.Literal("USER"), t.Literal("ADMIN")]),
    }),
  ),
  Organization: __nullable__(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      name: t.String(),
      description: t.String(),
    }),
  ),
});

export const OrganizationMemberPlainInputCreate = t.Object({
  role: t.Union([t.Literal("ADMIN"), t.Literal("MEMBER"), t.Literal("OWNER")]),
});

export const OrganizationMemberPlainInputUpdate = t.Object({
  role: t.Optional(
    t.Union([t.Literal("ADMIN"), t.Literal("MEMBER"), t.Literal("OWNER")]),
  ),
});

export const OrganizationMemberRelationsInputCreate = t.Object({
  User: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
  Organization: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
});

export const OrganizationMemberRelationsInputUpdate = t.Partial(
  t.Object({
    User: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
    Organization: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
  }),
);

export const OrganizationMemberWhere = t.Partial(
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
          role: t.Union([
            t.Literal("ADMIN"),
            t.Literal("MEMBER"),
            t.Literal("OWNER"),
          ]),
          userId: t.String(),
          organizationId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "OrganizationMember" },
  ),
);

export const OrganizationMemberWhereUnique = t.Recursive(
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
            role: t.Union([
              t.Literal("ADMIN"),
              t.Literal("MEMBER"),
              t.Literal("OWNER"),
            ]),
            userId: t.String(),
            organizationId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "OrganizationMember" },
);

export const OrganizationMemberSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    role: t.Boolean(),
    User: t.Boolean(),
    userId: t.Boolean(),
    Organization: t.Boolean(),
    organizationId: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const OrganizationMemberInclude = t.Partial(
  t.Object({
    role: t.Boolean(),
    User: t.Boolean(),
    Organization: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const OrganizationMemberOrderBy = t.Partial(
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
    userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    organizationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const OrganizationMember = t.Composite([
  OrganizationMemberPlain,
  OrganizationMemberRelations,
]);

export const OrganizationMemberInputCreate = t.Composite([
  OrganizationMemberPlainInputCreate,
  OrganizationMemberRelationsInputCreate,
]);

export const OrganizationMemberInputUpdate = t.Composite([
  OrganizationMemberPlainInputUpdate,
  OrganizationMemberRelationsInputUpdate,
]);
