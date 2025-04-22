import Elysia from "elysia";
import {
	type Config,
	adjectives,
	colors,
	uniqueNamesGenerator,
} from "unique-names-generator";

const customConfig: Config = {
	dictionaries: [adjectives, colors],
	separator: "-",
	length: 2,
};

export const wordsGeneratorPlugin = new Elysia({
	name: "words-generator-plugin",
	detail: {
		description: "Words generator plugin",
		summary: "Words generator plugin",
	},
})
	.resolve(async () => {
		return {
			generateRandomName: (): string[] => {
				const shortName: string = uniqueNamesGenerator(customConfig);

				return shortName.split("-");
			},
		};
	})
	.as("plugin");
