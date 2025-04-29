import Elysia, { t } from "elysia";
import { HttpError } from "elysia-http-error";
import * as _ from "lodash-es";
import { TranslationPlain } from "../../../../prisma/schema/prismabox/Translation";
import { allLanguageCodes } from "../../../data/language-codes";
import { authenticateUserPlugin } from "../../../procedures/stateful/authenticate-user-plugin";

export const UpdateTranslationSchema = t.Partial(
	t.Omit(
		t.Pick(TranslationPlain, [
			...allLanguageCodes.map((code) => `${code}Text`),
		]),
		["id", "createdAt", "updatedAt", "projectId"],
	),
);

export const updateRouter = new Elysia({
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

			const parsedUpdate = _.omitBy(ctx.body, _.isUndefined);

			const dbTranslation = await ctx.db.translation.update({
				where: {
					id: ctx.params.id,
				},
				data: parsedUpdate,
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
