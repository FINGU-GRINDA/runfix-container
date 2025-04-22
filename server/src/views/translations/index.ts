import Elysia from "elysia";

import { aiTranslateRouter } from "./ai-translate";
import { aiTranslateAllRouter } from "./ai-translate-all";
import { aiTranslateV2Router } from "./ai-translate-v2";
import { readTranslationRouter } from "./read";
import { readAllTranslationRouter } from "./read-all";

export const translationRouter = new Elysia({
	prefix: "/translations",
	tags: ["Translations"],
	name: "translations-router",
	detail: {
		description: "Translation management",
		summary: "Translation management",
	},
})
	.use(aiTranslateRouter)
	.use(readAllTranslationRouter)
	.use(readTranslationRouter)
	.use(aiTranslateAllRouter)
	.use(aiTranslateV2Router);
