import { Static, t } from "elysia";

export const translationSchema = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  enText: t.Nullable(t.String()), // English (USA)
  koText: t.Nullable(t.String()), // Korean
  jaText: t.Nullable(t.String()), // Japanese
  zhText: t.Nullable(t.String()), // Chinese
  uzText: t.Nullable(t.String()), // Uzbek (Uzbekistan)
  viText: t.Nullable(t.String()), // Vietnamese
  ruText: t.Nullable(t.String()), // Russian
  kkText: t.Nullable(t.String()), // Kazakh (Kazakhstan)
  mnText: t.Nullable(t.String()), // Mongolian (Mongolia)
  thText: t.Nullable(t.String()), // Thai
  idText: t.Nullable(t.String()), // Indonesian
  userId: t.Nullable(t.String()),
});

export const updateTranslationSchema = t.Object({
  enText: t.Optional(t.String()),
  koText: t.Optional(t.String()),
  jaText: t.Optional(t.String()),
  zhText: t.Optional(t.String()),
  uzText: t.Optional(t.String()),
  viText: t.Optional(t.String()),
  ruText: t.Optional(t.String()),
  kkText: t.Optional(t.String()),
  mnText: t.Optional(t.String()),
  thText: t.Optional(t.String()),
  idText: t.Optional(t.String()),
});

export type Translation = Static<typeof translationSchema>;
