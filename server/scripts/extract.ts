import { prisma } from "../src/data/prisma";

export const extractDb = async () => {
	const translations = await prisma.translation.findMany({
		select: {
			koText: true,
			context: true,
			path: true,
			jaText: true,
		},
		where: {
			koText: {
				not: null,
			},
			jaText: {
				not: null,
			},
		},
	});

	await Bun.write("./translations.json", JSON.stringify(translations));
};

await extractDb();
