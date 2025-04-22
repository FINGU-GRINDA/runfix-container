"use client";

import { useEffect } from "react";
import {
	translateAndFit,
	getGrindaTranslateFn,
	debugTranslateTextWithGoogle,
} from "runfix-container";
import { usePathname } from "next/navigation";
import getUserLocale from "get-user-locale";

export default function Translator({
	children,
}: {
	children: React.ReactNode;
}) {
	const targetLanguage = getUserLocale();
	const path = usePathname();
	console.log("path", path);
	console.log("target language", targetLanguage);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!window.document) return;

		const currentLanguage = document
			.querySelector("html")
			?.getAttribute("lang");
		const parsedTargetLanguage = targetLanguage
			? targetLanguage.toLowerCase().split("-")[0]
			: "en";
		if (!currentLanguage || !parsedTargetLanguage) return;
		if (currentLanguage === parsedTargetLanguage) return;

		console.log("language", currentLanguage, parsedTargetLanguage);
		const startTranslation = async () => {
			await translateAndFit({
				sourceLanguage: currentLanguage,
				targetLanguage: parsedTargetLanguage,
				fitConfig: {
					addOverflowBreak: true,
				},
				translateConfig: {
					// translateFn: debugTranslateTextWithGoogle,
					skipTranslateClasses: ["not-prose"],
					translateFn: getGrindaTranslateFn({
						apiKey: process.env.NEXT_PUBLIC_HANA_API_KEY,
						baseUrl: "https://api.hanalangconnect.site",
					}),
				},
			});

			// Update the html lang attribute
			// document
			// 	.querySelector("html")
			// 	?.setAttribute("lang", parsedTargetLanguage);
			console.log("translated");
		};

		startTranslation();
	}, [targetLanguage, path]);

	return <>{children}</>;
}
