import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SessionPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  userAgent: __nullable__(t.String()),
  headers: t.Any(),
  ipAddress: __nullable__(t.String()),
  invalidatedAt: __nullable__(t.Date()),
  version: t.Integer(),
  userId: t.String(),
});

export const SessionRelations = t.Object({
  User: t.Object({
    id: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    firstName: t.String(),
    lastName: t.String(),
    profilePicture: __nullable__(t.String()),
    role: t.Union([t.Literal("USER"), t.Literal("ADMIN")]),
  }),
});

export const SessionPlainInputCreate = t.Object({
  userAgent: t.Optional(__nullable__(t.String())),
  headers: t.Any(),
  ipAddress: t.Optional(__nullable__(t.String())),
  invalidatedAt: t.Optional(__nullable__(t.Date())),
  version: t.Optional(t.Integer()),
});

export const SessionPlainInputUpdate = t.Object({
  userAgent: t.Optional(__nullable__(t.String())),
  headers: t.Optional(t.Any()),
  ipAddress: t.Optional(__nullable__(t.String())),
  invalidatedAt: t.Optional(__nullable__(t.Date())),
  version: t.Optional(t.Integer()),
});

export const SessionRelationsInputCreate = t.Object({
  User: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const SessionRelationsInputUpdate = t.Partial(
  t.Object({
    User: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const SessionWhere = t.Partial(
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
          userAgent: t.String(),
          headers: t.Any(),
          ipAddress: t.String(),
          invalidatedAt: t.Date(),
          version: t.Integer(),
          userId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "Session" },
  ),
);

export const SessionWhereUnique = t.Recursive(
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
            userAgent: t.String(),
            headers: t.Any(),
            ipAddress: t.String(),
            invalidatedAt: t.Date(),
            version: t.Integer(),
            userId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Session" },
);

export const SessionSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    userAgent: t.Boolean(),
    headers: t.Boolean(),
    ipAddress: t.Boolean(),
    invalidatedAt: t.Boolean(),
    version: t.Boolean(),
    userId: t.Boolean(),
    User: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const SessionInclude = t.Partial(
  t.Object({ User: t.Boolean(), _count: t.Boolean() }),
);

export const SessionOrderBy = t.Partial(
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
    userAgent: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    headers: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    ipAddress: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    invalidatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    version: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Session = t.Composite([SessionPlain, SessionRelations]);

export const SessionInputCreate = t.Composite([
  SessionPlainInputCreate,
  SessionRelationsInputCreate,
]);

export const SessionInputUpdate = t.Composite([
  SessionPlainInputUpdate,
  SessionRelationsInputUpdate,
]);
