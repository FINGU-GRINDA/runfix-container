"use client";

import { useEffect } from "react";
import { translateAndFit, getGrindaTranslateFn } from "runfix-container";
import { useCookies } from "next-client-cookies";

export default function Translator({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookies = useCookies();
	const targetLanguage = cookies.get("NEXT_LOCALE");
	console.log("target language", targetLanguage);

	useEffect(() => {
		if (!window.document) return;

		const currentLanguage = document
			.querySelector("html")
			?.getAttribute("lang");
		if (!currentLanguage || !targetLanguage) return;
		if (currentLanguage === targetLanguage) return;

		console.log("language", currentLanguage, targetLanguage);
		const startTranslation = async () => {
			await translateAndFit({
				sourceLanguage: currentLanguage,
				targetLanguage: targetLanguage,
				fitConfig: {
					addOverflowBreak: true,
				},
				translateConfig: {
					translateFn: getGrindaTranslateFn({
						apiKey:
							"eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUcmFuc2xhdGlvbiBBUEkiLCJzdWIiOiJ7XCJpZFwiOlwiY205Y21qaGVvMDAwYnVnaGkxZW8yMnNmMVwiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTA0LTExVDEwOjA4OjI1LjYwNFpcIixcInVwZGF0ZWRBdFwiOlwiMjAyNS0wNC0xMVQxMDowODoyNS42MDRaXCIsXCJuYW1lXCI6XCJEZWZhdWx0IFByb2plY3RcIixcImRlc2NyaXB0aW9uXCI6XCJEZWZhdWx0IFByb2plY3RcIixcIm9yZ2FuaXphdGlvbklkXCI6XCJjbTljbWpoZW8wMDBhdWdoaTIxYmNtaHVhXCJ9In0.Ea_TDMrqFP7YY4OU2PmXRsEirIE0jTOqw6_S5iHOKvU",
						baseUrl: "https://hana-i18n.198.23.164.177.sslip.io",
					}),
					skipTranslateClass: "nextra-code",
				},
			});

			// Update the html lang attribute
			document.querySelector("html")?.setAttribute("lang", targetLanguage);
			console.log("translated");
		};

		startTranslation();
	}, [targetLanguage]);

	return <>{children}</>;
}
