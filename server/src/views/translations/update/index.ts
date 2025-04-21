import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import { TranslationPlain } from "../../../../prisma/schema/prismabox/Translation";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";
import { allLanguageCodes } from "../constants";

export const UpdateTranslationSchema = t.Optional(
	t.Omit(
		t.Pick(TranslationPlain, [
			...allLanguageCodes.map((code) => `${code}Text`),
		]),
		["id", "createdAt", "updatedAt", "projectId"],
	),
);

export const updateTranslationRouter = new Elysia({
	prefix: "/translations",
	tags: ["Translations"],
	name: "update-translation-router",
	detail: {
		description: "Update a translation",
		summary: "Update a translation",
	},
})
	.use(authenticateUserPlugin)
	.patch(
		"/:id",
		async (ctx) => {
			if (!ctx.user) {
				throw HttpError.Unauthorized("Please sign in");
			}

			if (!ctx.params.id) {
				throw HttpError.BadRequest("Missing translation id");
			}

			const dbTranslation = await ctx.db.translation.update({
				where: {
					id: ctx.params.id,
				},
				data: { ...ctx.body },
			});

			return dbTranslation;
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: UpdateTranslationSchema,
			response: TranslationPlain,
		},
	);
