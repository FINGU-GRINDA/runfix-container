import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PasskeyAuthPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  publicKey: t.Uint8Array(),
  webAuthnUserId: t.String(),
  counter: t.Integer(),
  deviceType: t.String(),
  backedUpAt: __nullable__(t.Date()),
  isBackupEligible: __nullable__(t.Boolean()),
  transports: t.String(),
  userId: __nullable__(t.String()),
});

export const PasskeyAuthRelations = t.Object({
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

export const PasskeyAuthPlainInputCreate = t.Object({
  publicKey: t.Uint8Array(),
  counter: t.Integer(),
  deviceType: t.String(),
  backedUpAt: t.Optional(__nullable__(t.Date())),
  isBackupEligible: t.Optional(__nullable__(t.Boolean())),
  transports: t.String(),
});

export const PasskeyAuthPlainInputUpdate = t.Object({
  publicKey: t.Optional(t.Uint8Array()),
  counter: t.Optional(t.Integer()),
  deviceType: t.Optional(t.String()),
  backedUpAt: t.Optional(__nullable__(t.Date())),
  isBackupEligible: t.Optional(__nullable__(t.Boolean())),
  transports: t.Optional(t.String()),
});

export const PasskeyAuthRelationsInputCreate = t.Object({
  User: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
});

export const PasskeyAuthRelationsInputUpdate = t.Partial(
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

export const PasskeyAuthWhere = t.Partial(
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
          publicKey: t.Uint8Array(),
          webAuthnUserId: t.String(),
          counter: t.Integer(),
          deviceType: t.String(),
          backedUpAt: t.Date(),
          isBackupEligible: t.Boolean(),
          transports: t.String(),
          userId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "PasskeyAuth" },
  ),
);

export const PasskeyAuthWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), publicKey: t.Uint8Array() },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ publicKey: t.Uint8Array() }),
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
            publicKey: t.Uint8Array(),
            webAuthnUserId: t.String(),
            counter: t.Integer(),
            deviceType: t.String(),
            backedUpAt: t.Date(),
            isBackupEligible: t.Boolean(),
            transports: t.String(),
            userId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "PasskeyAuth" },
);

export const PasskeyAuthSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    publicKey: t.Boolean(),
    webAuthnUserId: t.Boolean(),
    counter: t.Boolean(),
    deviceType: t.Boolean(),
    backedUpAt: t.Boolean(),
    isBackupEligible: t.Boolean(),
    transports: t.Boolean(),
    userId: t.Boolean(),
    User: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const PasskeyAuthInclude = t.Partial(
  t.Object({ User: t.Boolean(), _count: t.Boolean() }),
);

export const PasskeyAuthOrderBy = t.Partial(
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
    publicKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    webAuthnUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    counter: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    deviceType: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    backedUpAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    isBackupEligible: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    transports: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const PasskeyAuth = t.Composite([
  PasskeyAuthPlain,
  PasskeyAuthRelations,
]);

export const PasskeyAuthInputCreate = t.Composite([
  PasskeyAuthPlainInputCreate,
  PasskeyAuthRelationsInputCreate,
]);

export const PasskeyAuthInputUpdate = t.Composite([
  PasskeyAuthPlainInputUpdate,
  PasskeyAuthRelationsInputUpdate,
]);
