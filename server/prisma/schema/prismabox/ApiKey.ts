import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ApiKeyPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  lastFourChars: __nullable__(t.String()),
  usageCount: t.Integer(),
  readAccess: t.Boolean(),
  writeAccess: t.Boolean(),
  projectId: __nullable__(t.String()),
});

export const ApiKeyRelations = t.Object({
  Project: __nullable__(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      name: t.String(),
      description: t.String(),
      organizationId: __nullable__(t.String()),
    }),
  ),
});

export const ApiKeyPlainInputCreate = t.Object({
  lastFourChars: t.Optional(__nullable__(t.String())),
  usageCount: t.Optional(t.Integer()),
  readAccess: t.Optional(t.Boolean()),
  writeAccess: t.Optional(t.Boolean()),
});

export const ApiKeyPlainInputUpdate = t.Object({
  lastFourChars: t.Optional(__nullable__(t.String())),
  usageCount: t.Optional(t.Integer()),
  readAccess: t.Optional(t.Boolean()),
  writeAccess: t.Optional(t.Boolean()),
});

export const ApiKeyRelationsInputCreate = t.Object({
  Project: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
});

export const ApiKeyRelationsInputUpdate = t.Partial(
  t.Object({
    Project: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
  }),
);

export const ApiKeyWhere = t.Partial(
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
          lastFourChars: t.String(),
          usageCount: t.Integer(),
          readAccess: t.Boolean(),
          writeAccess: t.Boolean(),
          projectId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "ApiKey" },
  ),
);

export const ApiKeyWhereUnique = t.Recursive(
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
            lastFourChars: t.String(),
            usageCount: t.Integer(),
            readAccess: t.Boolean(),
            writeAccess: t.Boolean(),
            projectId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "ApiKey" },
);

export const ApiKeySelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    lastFourChars: t.Boolean(),
    usageCount: t.Boolean(),
    readAccess: t.Boolean(),
    writeAccess: t.Boolean(),
    Project: t.Boolean(),
    projectId: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const ApiKeyInclude = t.Partial(
  t.Object({ Project: t.Boolean(), _count: t.Boolean() }),
);

export const ApiKeyOrderBy = t.Partial(
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
    lastFourChars: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    usageCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    readAccess: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    writeAccess: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    projectId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const ApiKey = t.Composite([ApiKeyPlain, ApiKeyRelations]);

export const ApiKeyInputCreate = t.Composite([
  ApiKeyPlainInputCreate,
  ApiKeyRelationsInputCreate,
]);

export const ApiKeyInputUpdate = t.Composite([
  ApiKeyPlainInputUpdate,
  ApiKeyRelationsInputUpdate,
]);
