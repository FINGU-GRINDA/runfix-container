import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  firstName: t.String(),
  lastName: t.String(),
  profilePicture: __nullable__(t.String()),
  role: t.Union([t.Literal("USER"), t.Literal("ADMIN")]),
});

export const UserRelations = t.Object({
  PasskeyAuths: t.Array(
    t.Object({
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
    }),
    { additionalProperties: true },
  ),
  EmailAuths: t.Array(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      emailAddress: t.String(),
      password: __nullable__(t.String()),
      verificationSendAt: __nullable__(t.Date()),
      verifiedAt: __nullable__(t.Date()),
      userId: __nullable__(t.String()),
    }),
    { additionalProperties: true },
  ),
  Sessions: t.Array(
    t.Object({
      id: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      userAgent: __nullable__(t.String()),
      headers: t.Any(),
      ipAddress: __nullable__(t.String()),
      invalidatedAt: __nullable__(t.Date()),
      version: t.Integer(),
      userId: t.String(),
    }),
    { additionalProperties: true },
  ),
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
});

export const UserPlainInputCreate = t.Object({
  firstName: t.String(),
  lastName: t.String(),
  profilePicture: t.Optional(__nullable__(t.String())),
  role: t.Union([t.Literal("USER"), t.Literal("ADMIN")]),
});

export const UserPlainInputUpdate = t.Object({
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  profilePicture: t.Optional(__nullable__(t.String())),
  role: t.Optional(t.Union([t.Literal("USER"), t.Literal("ADMIN")])),
});

export const UserRelationsInputCreate = t.Object({
  PasskeyAuths: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
  EmailAuths: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
  Sessions: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
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
});

export const UserRelationsInputUpdate = t.Partial(
  t.Object({
    PasskeyAuths: t.Partial(
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
    EmailAuths: t.Partial(
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
    Sessions: t.Partial(
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
  }),
);

export const UserWhere = t.Partial(
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
          firstName: t.String(),
          lastName: t.String(),
          profilePicture: t.String(),
          role: t.Union([t.Literal("USER"), t.Literal("ADMIN")]),
        },
        { additionalProperties: true },
      ),
    { $id: "User" },
  ),
);

export const UserWhereUnique = t.Recursive(
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
            firstName: t.String(),
            lastName: t.String(),
            profilePicture: t.String(),
            role: t.Union([t.Literal("USER"), t.Literal("ADMIN")]),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    firstName: t.Boolean(),
    lastName: t.Boolean(),
    profilePicture: t.Boolean(),
    role: t.Boolean(),
    PasskeyAuths: t.Boolean(),
    EmailAuths: t.Boolean(),
    Sessions: t.Boolean(),
    OrganizationMembers: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const UserInclude = t.Partial(
  t.Object({
    role: t.Boolean(),
    PasskeyAuths: t.Boolean(),
    EmailAuths: t.Boolean(),
    Sessions: t.Boolean(),
    OrganizationMembers: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const UserOrderBy = t.Partial(
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
    firstName: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    lastName: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    profilePicture: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const User = t.Composite([UserPlain, UserRelations]);

export const UserInputCreate = t.Composite([
  UserPlainInputCreate,
  UserRelationsInputCreate,
]);

export const UserInputUpdate = t.Composite([
  UserPlainInputUpdate,
  UserRelationsInputUpdate,
]);
