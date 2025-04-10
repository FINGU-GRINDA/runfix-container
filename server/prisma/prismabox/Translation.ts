import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TranslationPlain = t.Object({
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
});

export const TranslationRelations = t.Object({
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

export const TranslationPlainInputCreate = t.Object({
  enText: t.Optional(__nullable__(t.String())),
  koText: t.Optional(__nullable__(t.String())),
  jaText: t.Optional(__nullable__(t.String())),
  zhText: t.Optional(__nullable__(t.String())),
  uzText: t.Optional(__nullable__(t.String())),
  viText: t.Optional(__nullable__(t.String())),
  ruText: t.Optional(__nullable__(t.String())),
  kkText: t.Optional(__nullable__(t.String())),
  mnText: t.Optional(__nullable__(t.String())),
  thText: t.Optional(__nullable__(t.String())),
  idText: t.Optional(__nullable__(t.String())),
});

export const TranslationPlainInputUpdate = t.Object({
  enText: t.Optional(__nullable__(t.String())),
  koText: t.Optional(__nullable__(t.String())),
  jaText: t.Optional(__nullable__(t.String())),
  zhText: t.Optional(__nullable__(t.String())),
  uzText: t.Optional(__nullable__(t.String())),
  viText: t.Optional(__nullable__(t.String())),
  ruText: t.Optional(__nullable__(t.String())),
  kkText: t.Optional(__nullable__(t.String())),
  mnText: t.Optional(__nullable__(t.String())),
  thText: t.Optional(__nullable__(t.String())),
  idText: t.Optional(__nullable__(t.String())),
});

export const TranslationRelationsInputCreate = t.Object({
  Project: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
});

export const TranslationRelationsInputUpdate = t.Partial(
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

export const TranslationWhere = t.Partial(
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
          enText: t.String(),
          koText: t.String(),
          jaText: t.String(),
          zhText: t.String(),
          uzText: t.String(),
          viText: t.String(),
          ruText: t.String(),
          kkText: t.String(),
          mnText: t.String(),
          thText: t.String(),
          idText: t.String(),
          projectId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "Translation" },
  ),
);

export const TranslationWhereUnique = t.Recursive(
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
            enText: t.String(),
            koText: t.String(),
            jaText: t.String(),
            zhText: t.String(),
            uzText: t.String(),
            viText: t.String(),
            ruText: t.String(),
            kkText: t.String(),
            mnText: t.String(),
            thText: t.String(),
            idText: t.String(),
            projectId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Translation" },
);

export const TranslationSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    enText: t.Boolean(),
    koText: t.Boolean(),
    jaText: t.Boolean(),
    zhText: t.Boolean(),
    uzText: t.Boolean(),
    viText: t.Boolean(),
    ruText: t.Boolean(),
    kkText: t.Boolean(),
    mnText: t.Boolean(),
    thText: t.Boolean(),
    idText: t.Boolean(),
    Project: t.Boolean(),
    projectId: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const TranslationInclude = t.Partial(
  t.Object({ Project: t.Boolean(), _count: t.Boolean() }),
);

export const TranslationOrderBy = t.Partial(
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
    enText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    koText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    jaText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    zhText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    uzText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    viText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    ruText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    kkText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    mnText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    thText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    idText: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    projectId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Translation = t.Composite([
  TranslationPlain,
  TranslationRelations,
]);

export const TranslationInputCreate = t.Composite([
  TranslationPlainInputCreate,
  TranslationRelationsInputCreate,
]);

export const TranslationInputUpdate = t.Composite([
  TranslationPlainInputUpdate,
  TranslationRelationsInputUpdate,
]);
