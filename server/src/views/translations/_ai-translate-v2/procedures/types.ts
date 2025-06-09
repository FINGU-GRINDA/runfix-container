import { type Static, t } from "elysia";

export const BingResponseSchema = t.Array(
	t.Object({
		translations: t.Array(
			t.Object({
				text: t.String(),
				to: t.String(),
				sentLen: t.Object({
					srcSentLen: t.Array(t.Number()),
					transSentLen: t.Array(t.Number()),
				}),
			}),
		),
	}),
);

export type BingResponse = Static<typeof BingResponseSchema>;
