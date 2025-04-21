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
      lastFourChars: __nullable__(t.String()),
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
      aaText: __nullable__(t.String()),
      abText: __nullable__(t.String()),
      aeText: __nullable__(t.String()),
      afText: __nullable__(t.String()),
      akText: __nullable__(t.String()),
      amText: __nullable__(t.String()),
      anText: __nullable__(t.String()),
      arText: __nullable__(t.String()),
      asText: __nullable__(t.String()),
      avText: __nullable__(t.String()),
      ayText: __nullable__(t.String()),
      azText: __nullable__(t.String()),
      baText: __nullable__(t.String()),
      beText: __nullable__(t.String()),
      bgText: __nullable__(t.String()),
      bhText: __nullable__(t.String()),
      biText: __nullable__(t.String()),
      bmText: __nullable__(t.String()),
      bnText: __nullable__(t.String()),
      boText: __nullable__(t.String()),
      brText: __nullable__(t.String()),
      bsText: __nullable__(t.String()),
      caText: __nullable__(t.String()),
      ceText: __nullable__(t.String()),
      chText: __nullable__(t.String()),
      coText: __nullable__(t.String()),
      crText: __nullable__(t.String()),
      csText: __nullable__(t.String()),
      cuText: __nullable__(t.String()),
      cvText: __nullable__(t.String()),
      cyText: __nullable__(t.String()),
      daText: __nullable__(t.String()),
      deText: __nullable__(t.String()),
      dvText: __nullable__(t.String()),
      dzText: __nullable__(t.String()),
      eeText: __nullable__(t.String()),
      elText: __nullable__(t.String()),
      enText: __nullable__(t.String()),
      eoText: __nullable__(t.String()),
      esText: __nullable__(t.String()),
      etText: __nullable__(t.String()),
      euText: __nullable__(t.String()),
      faText: __nullable__(t.String()),
      ffText: __nullable__(t.String()),
      fiText: __nullable__(t.String()),
      fjText: __nullable__(t.String()),
      foText: __nullable__(t.String()),
      frText: __nullable__(t.String()),
      fyText: __nullable__(t.String()),
      gaText: __nullable__(t.String()),
      gdText: __nullable__(t.String()),
      glText: __nullable__(t.String()),
      gnText: __nullable__(t.String()),
      guText: __nullable__(t.String()),
      gvText: __nullable__(t.String()),
      haText: __nullable__(t.String()),
      heText: __nullable__(t.String()),
      hiText: __nullable__(t.String()),
      hoText: __nullable__(t.String()),
      hrText: __nullable__(t.String()),
      htText: __nullable__(t.String()),
      huText: __nullable__(t.String()),
      hyText: __nullable__(t.String()),
      hzText: __nullable__(t.String()),
      iaText: __nullable__(t.String()),
      idText: __nullable__(t.String()),
      ieText: __nullable__(t.String()),
      igText: __nullable__(t.String()),
      iiText: __nullable__(t.String()),
      ikText: __nullable__(t.String()),
      ioText: __nullable__(t.String()),
      isText: __nullable__(t.String()),
      itText: __nullable__(t.String()),
      iuText: __nullable__(t.String()),
      jaText: __nullable__(t.String()),
      jvText: __nullable__(t.String()),
      kaText: __nullable__(t.String()),
      kgText: __nullable__(t.String()),
      kiText: __nullable__(t.String()),
      kjText: __nullable__(t.String()),
      kkText: __nullable__(t.String()),
      klText: __nullable__(t.String()),
      kmText: __nullable__(t.String()),
      knText: __nullable__(t.String()),
      koText: __nullable__(t.String()),
      krText: __nullable__(t.String()),
      ksText: __nullable__(t.String()),
      kuText: __nullable__(t.String()),
      kvText: __nullable__(t.String()),
      kwText: __nullable__(t.String()),
      kyText: __nullable__(t.String()),
      laText: __nullable__(t.String()),
      lbText: __nullable__(t.String()),
      lgText: __nullable__(t.String()),
      liText: __nullable__(t.String()),
      lnText: __nullable__(t.String()),
      loText: __nullable__(t.String()),
      ltText: __nullable__(t.String()),
      luText: __nullable__(t.String()),
      lvText: __nullable__(t.String()),
      mgText: __nullable__(t.String()),
      mhText: __nullable__(t.String()),
      miText: __nullable__(t.String()),
      mkText: __nullable__(t.String()),
      mlText: __nullable__(t.String()),
      mnText: __nullable__(t.String()),
      mrText: __nullable__(t.String()),
      msText: __nullable__(t.String()),
      mtText: __nullable__(t.String()),
      myText: __nullable__(t.String()),
      naText: __nullable__(t.String()),
      nbText: __nullable__(t.String()),
      ndText: __nullable__(t.String()),
      neText: __nullable__(t.String()),
      ngText: __nullable__(t.String()),
      nlText: __nullable__(t.String()),
      nnText: __nullable__(t.String()),
      noText: __nullable__(t.String()),
      nrText: __nullable__(t.String()),
      nvText: __nullable__(t.String()),
      nyText: __nullable__(t.String()),
      ocText: __nullable__(t.String()),
      ojText: __nullable__(t.String()),
      omText: __nullable__(t.String()),
      orText: __nullable__(t.String()),
      osText: __nullable__(t.String()),
      paText: __nullable__(t.String()),
      piText: __nullable__(t.String()),
      plText: __nullable__(t.String()),
      psText: __nullable__(t.String()),
      ptText: __nullable__(t.String()),
      quText: __nullable__(t.String()),
      rmText: __nullable__(t.String()),
      rnText: __nullable__(t.String()),
      roText: __nullable__(t.String()),
      ruText: __nullable__(t.String()),
      rwText: __nullable__(t.String()),
      saText: __nullable__(t.String()),
      scText: __nullable__(t.String()),
      sdText: __nullable__(t.String()),
      seText: __nullable__(t.String()),
      sgText: __nullable__(t.String()),
      siText: __nullable__(t.String()),
      skText: __nullable__(t.String()),
      slText: __nullable__(t.String()),
      smText: __nullable__(t.String()),
      snText: __nullable__(t.String()),
      soText: __nullable__(t.String()),
      sqText: __nullable__(t.String()),
      srText: __nullable__(t.String()),
      ssText: __nullable__(t.String()),
      stText: __nullable__(t.String()),
      suText: __nullable__(t.String()),
      svText: __nullable__(t.String()),
      swText: __nullable__(t.String()),
      taText: __nullable__(t.String()),
      teText: __nullable__(t.String()),
      tgText: __nullable__(t.String()),
      thText: __nullable__(t.String()),
      tiText: __nullable__(t.String()),
      tkText: __nullable__(t.String()),
      tlText: __nullable__(t.String()),
      tnText: __nullable__(t.String()),
      toText: __nullable__(t.String()),
      trText: __nullable__(t.String()),
      tsText: __nullable__(t.String()),
      ttText: __nullable__(t.String()),
      twText: __nullable__(t.String()),
      tyText: __nullable__(t.String()),
      ugText: __nullable__(t.String()),
      ukText: __nullable__(t.String()),
      urText: __nullable__(t.String()),
      uzText: __nullable__(t.String()),
      veText: __nullable__(t.String()),
      viText: __nullable__(t.String()),
      voText: __nullable__(t.String()),
      waText: __nullable__(t.String()),
      woText: __nullable__(t.String()),
      xhText: __nullable__(t.String()),
      yiText: __nullable__(t.String()),
      yoText: __nullable__(t.String()),
      zaText: __nullable__(t.String()),
      zhText: __nullable__(t.String()),
      zuText: __nullable__(t.String()),
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
