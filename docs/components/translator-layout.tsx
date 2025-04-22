"use client";

import { useEffect } from "react";
import { translateAndFit, getGrindaTranslateFn } from "runfix-container";
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
					translateFn: getGrindaTranslateFn({
						apiKey:
							"eyJhbGciOiJIUzI1NiJ9.eyJhcGlLZXkiOnsiaWQiOiJjbTlzMDNxcjUwMDA3dWc1ZW90ZGNrMmljIiwiY3JlYXRlZEF0IjoiMjAyNS0wNC0yMlQwNDoyNDozOC43MDZaIiwidXBkYXRlZEF0IjoiMjAyNS0wNC0yMlQwNDoyNDozOC43MDZaIiwibGFzdEZvdXJDaGFycyI6bnVsbCwidXNhZ2VDb3VudCI6MCwicHJvamVjdElkIjoiY205czAzaGp6MDAwNXVnNWUwaDlmcGR4aSIsIlByb2plY3QiOnsiaWQiOiJjbTlzMDNoanowMDA1dWc1ZTBoOWZwZHhpIiwiY3JlYXRlZEF0IjoiMjAyNS0wNC0yMlQwNDoyNDoyNS42NjlaIiwidXBkYXRlZEF0IjoiMjAyNS0wNC0yMlQwNDoyNDoyNS42NjlaIiwibmFtZSI6ImRvYyIsImRlc2NyaXB0aW9uIjoiIiwib3JnYW5pemF0aW9uSWQiOiJjbTlyeTJlcWMwMDAydWdrZG1zNzBvcDRhIn19LCJleHAiOjMzMjgxMjk1ODgwLCJpYXQiOjE3NDUyOTU4ODB9.6E6-YvvYIfaehndbOETQ29wJkDKulOj8d3fLxKIfqUc",
						baseUrl: "https://api.hanalangconnect.site",
					}),
					skipTranslateClass: "nextra-code",
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
