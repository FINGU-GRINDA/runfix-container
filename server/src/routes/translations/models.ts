import { Static, t } from "elysia";
import { Translation } from "../../../prisma/prismabox/Translation";

import { allLanguageCodes } from "./constants";

export const BaseTranslation = t.Pick(Translation, [
  "id",
  "createdAt",
  "updatedAt",
  "projectId",
  ...allLanguageCodes.map((code) => `${code}Text`),
]);

export type BaseTranslation = Static<typeof BaseTranslation>;

export const UpdateTranslation = t.Pick(Translation, [
  ...allLanguageCodes.map((code) => `${code}Text`),
]);

export type UpdateTranslation = Static<typeof UpdateTranslation>;

export const UpdateTranslationSchema = t.Pick(Translation, [
  ...allLanguageCodes.map((code) => `${code}Text`),
]);

export type UpdateTranslationSchema = Static<typeof UpdateTranslationSchema>;
