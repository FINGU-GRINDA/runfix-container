import { Kind } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { Elysia, type TSchema } from "elysia";

export const parseValuePlugin = new Elysia({
	name: "parse-value-plugin",
})
	.resolve(async (_ctx) => {
		return {
			parseValue: parseValue,
		};
	})
	.as("plugin");

export function parseValue<T extends TSchema>(schema: T, value: unknown) {
	return Value.Parse(schema as unknown as T & { [Kind]: "" }, value);
}
