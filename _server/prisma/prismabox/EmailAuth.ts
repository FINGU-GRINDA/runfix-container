import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmailAuthPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  emailAddress: t.String(),
  password: t.String(),
  userId: t.String(),
});

export const EmailAuthRelations = t.Object({
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

export const EmailAuthPlainInputCreate = t.Object({
  emailAddress: t.String(),
  password: t.String(),
});

export const EmailAuthPlainInputUpdate = t.Object({
  emailAddress: t.Optional(t.String()),
  password: t.Optional(t.String()),
});

export const EmailAuthRelationsInputCreate = t.Object({
  User: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const EmailAuthRelationsInputUpdate = t.Partial(
  t.Object({
    User: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const EmailAuthWhere = t.Partial(
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
          emailAddress: t.String(),
          password: t.String(),
          userId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "EmailAuth" },
  ),
);

export const EmailAuthWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), emailAddress: t.String() },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ emailAddress: t.String() }),
          ],
          { additionalProperties: true },
        ),
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
            emailAddress: t.String(),
            password: t.String(),
            userId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "EmailAuth" },
);

export const EmailAuthSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    emailAddress: t.Boolean(),
    password: t.Boolean(),
    userId: t.Boolean(),
    User: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const EmailAuthInclude = t.Partial(
  t.Object({ User: t.Boolean(), _count: t.Boolean() }),
);

export const EmailAuthOrderBy = t.Partial(
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
    emailAddress: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    password: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const EmailAuth = t.Composite([EmailAuthPlain, EmailAuthRelations]);

export const EmailAuthInputCreate = t.Composite([
  EmailAuthPlainInputCreate,
  EmailAuthRelationsInputCreate,
]);

export const EmailAuthInputUpdate = t.Composite([
  EmailAuthPlainInputUpdate,
  EmailAuthRelationsInputUpdate,
]);
