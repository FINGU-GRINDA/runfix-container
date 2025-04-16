# NextJS pages router

## Installation

add `runfix-container` and `nuqs` package

```bash
npm install runfix-container nuqs
```
Finish setting up nuqs if you haven't, this enable typesafe url query state management - optional.

[nuqs-setup](https://nuqs.47ng.com/docs/adapters)

on your layout component that is rendered on the client, add this


create this file `components/translator-layout.tsx`

```tsx
"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { translateAndFit, getGrindaTranslateFn } from "runfix-container";

export default function Translator({
	children,
}: {
	children: React.ReactNode;
}) {
	// Use nuqs for query state management
	const [langParam, setLangParam] = useQueryState(
		"lang",
		parseAsString.withDefault("ko"),
	);

	useEffect(() => {
		if (!window.document) return;

		const currentLanguage = document
			.querySelector("html")
			?.getAttribute("lang");
		if (!currentLanguage || !langParam) return;
		if (currentLanguage === langParam) return;

		const startTranslation = async () => {
			await translateAndFit({
				sourceLanguage: currentLanguage,
				targetLanguage: langParam,
				fitConfig: {
					addOverflowBreak: true,
				},
				translateConfig: {
					translateFn: getGrindaTranslateFn({
						apiKey:
							"eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUcmFuc2xhdGlvbiBBUEkiLCJzdWIiOiJ7XCJpZFwiOlwiY205Y21qaGVvMDAwYnVnaGkxZW8yMnNmMVwiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTA0LTExVDEwOjA4OjI1LjYwNFpcIixcInVwZGF0ZWRBdFwiOlwiMjAyNS0wNC0xMVQxMDowODoyNS42MDRaXCIsXCJuYW1lXCI6XCJEZWZhdWx0IFByb2plY3RcIixcImRlc2NyaXB0aW9uXCI6XCJEZWZhdWx0IFByb2plY3RcIixcIm9yZ2FuaXphdGlvbklkXCI6XCJjbTljbWpoZW8wMDBhdWdoaTIxYmNtaHVhXCJ9In0.Ea_TDMrqFP7YY4OU2PmXRsEirIE0jTOqw6_S5iHOKvU",
						baseUrl: "https://hana-i18n.198.23.164.177.sslip.io",
					}),
				},
			});

			// Update the html lang attribute
			document.querySelector("html")?.setAttribute("lang", langParam);
		};

		startTranslation();
	}, [langParam]);

	return <>{children}</>;
}

```

and import it on the root `layout.tsx` file


```tsx
export default async function RootLayout({ children }) {
	return (
		<html
			lang="en"
			dir="ltr"
			suppressHydrationWarning
		>
			<Head
			// ... Your additional head options
			>
				{/* Your additional tags should be passed as `children` of `<Head>` element */}
			</Head>
			<body>
				<NuqsAdapter>
					<Translator>
						<Layout
							banner={banner}
							navbar={navbar}
							pageMap={await getPageMap()}
							docsRepositoryBase="https://github.com/FINGU-GRINDA/runfix-container/tree/main/docs"
							feedback={{
								content:
									"https://github.com/FINGU-GRINDA/runfix-container/issues",
								labels: "bug",
							}}
							footer={footer}
							// ... Your additional layout options
						>
							{children}
						</Layout>
					</Translator>
				</NuqsAdapter>
			</body>
		</html>
	);
}
```

What does it do ?

- it will translate the whole doc every time the language changes (query param `?lang=xx`)
- it will deduct the source language based on
    - html lang attribute
- it will deduct target language based on
    - query param `?lang=xx`
    - default to `ko`
- it will add overflow break to prevent text overflow
- it will check for existing overflow, and diff it after translation
- it will group scale the translated text to prevent overflow
- it will update the html lang attribute after translation


Optionally, you can use `translateAndFit` directly without external / remote translation server, it will use google translate by default

Here's the default param and interface for `translateAndFit`

```tsx
export const translateAndFitParams = {
  sourceLanguage: "en",
  targetLanguage: "ko",
  fitConfig: {
    addOverflowBreak: true,
    skipFitClass: "skip-fit",
  },
  translateConfig: {
    skipTranslateClass: "skip-translate",
    translateFn: translateTextWithGoogle,
  },
};

```

And here's the interface for `translateTextWithGoogle` (this is the default), you can easily swap it with your own translation function. Handle the caching using json file remotely or locally, or use our remote translation server for remote cache management, monitoring and centralized translation.

```tsx
export const translateTextWithGoogle = async (params: {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}) => {
  return "translated text";
};
```

Here's the interface for our remote translation `getGrindaTranslateFn`

```tsx
export const getGrindaTranslateFn = async (params: {
  apiKey: string;
  baseUrl: string;
}) => {
  return async (params: {
    sourceText: string;
    sourceLanguage: string;
    targetLanguage: string;
    context?: string;
  }) => {
    return "translated text";
  };
};
