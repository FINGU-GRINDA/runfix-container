import type { Static } from "elysia";
import { t } from "elysia";
import { TranslationPlain } from "../../../prisma/prismabox/Translation";

import { allLanguageCodes } from "./constants";

export const BaseTranslationSchema = t.Pick(TranslationPlain, [
	"id",
	"createdAt",
	"updatedAt",
	"projectId",
	...allLanguageCodes.map((code) => `${code}Text`),
]);

export type BaseTranslation = Static<typeof BaseTranslationSchema>;

export const UpdateTranslationSchema = t.Optional(
	t.Pick(TranslationPlain, [...allLanguageCodes.map((code) => `${code}Text`)]),
);

export type UpdateTranslation = Static<typeof UpdateTranslationSchema>;
