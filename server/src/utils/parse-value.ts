import { Kind } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/build/cjs/value";
import { TSchema } from "elysia";

export function parseValue<T extends TSchema>(schema: T, value: unknown) {
  return Value.Parse(schema as unknown as T & { [Kind]: "" }, value);
}
