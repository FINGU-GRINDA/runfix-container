import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TranslationLogPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  sourceLanguage: t.String(),
  targetLanguage: t.String(),
  sourceText: t.String(),
  targetText: t.String(),
  userId: __nullable__(t.String()),
});

export const TranslationLogRelations = t.Object({
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
});

export const TranslationLogPlainInputCreate = t.Object({
  sourceLanguage: t.String(),
  targetLanguage: t.String(),
  sourceText: t.String(),
  targetText: t.String(),
});

export const TranslationLogPlainInputUpdate = t.Object({
  sourceLanguage: t.Optional(t.String()),
  targetLanguage: t.Optional(t.String()),
  sourceText: t.Optional(t.String()),
  targetText: t.Optional(t.String()),
});

export const TranslationLogRelationsInputCreate = t.Object({
  User: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
});

export const TranslationLogRelationsInputUpdate = t.Partial(
  t.Object({
    User: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
  }),
);

export const TranslationLogWhere = t.Partial(
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
          sourceLanguage: t.String(),
          targetLanguage: t.String(),
          sourceText: t.String(),
          targetText: t.String(),
          userId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "TranslationLog" },
  ),
);

export const TranslationLogWhereUnique = t.Recursive(
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
            sourceLanguage: t.String(),
            targetLanguage: t.String(),
            sourceText: t.String(),
            targetText: t.String(),
            userId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "TranslationLog" },
);

export const TranslationLogSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    sourceLanguage: t.Boolean(),
    targetLanguage: t.Boolean(),
    sourceText: t.Boolean(),
    targetText: t.Boolean(),
    User: t.Boolean(),
    userId: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const TranslationLogInclude = t.Partial(
  t.Object({ User: t.Boolean(), _count: t.Boolean() }),
);

export const TranslationLogOrderBy = t.Partial(
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
    sourceLanguage: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    targetLanguage: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    sourceText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    targetText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const TranslationLog = t.Composite([
  TranslationLogPlain,
  TranslationLogRelations,
]);

export const TranslationLogInputCreate = t.Composite([
  TranslationLogPlainInputCreate,
  TranslationLogRelationsInputCreate,
]);

export const TranslationLogInputUpdate = t.Composite([
  TranslationLogPlainInputUpdate,
  TranslationLogRelationsInputUpdate,
]);
