# NextJS app router

## Installation

add `runfix-container` package `get-user-locale` package

```bash
npm install runfix-container get-user-locale
```

On your app/layout.tsx file, add the CookiesProvider:

on your layout component that is rendered on the client, add this

create this file `components/translator.tsx`

```tsx filename="components/translator.tsx"
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
              "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUcmFuc2xhdGlvbiBBUEkiLCJzdWIiOiJ7XCJpZFwiOlwiY205Y21qaGVvMDAwYnVnaGkxZW8yMnNmMVwiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTA0LTExVDEwOjA4OjI1LjYwNFpcIixcInVwZGF0ZWRBdFwiOlwiMjAyNS0wNC0xMVQxMDowODoyNS42MDRaXCIsXCJuYW1lXCI6XCJEZWZhdWx0IFByb2plY3RcIixcImRlc2NyaXB0aW9uXCI6XCJEZWZhdWx0IFByb2plY3RcIixcIm9yZ2FuaXphdGlvbklkXCI6XCJjbTljbWpoZW8wMDBhdWdoaTIxYmNtaHVhXCJ9In0.Ea_TDMrqFP7YY4OU2PmXRsEirIE0jTOqw6_S5iHOKvU",
            baseUrl: "https://api.hanalangconnect.site",
          }),
          skipTranslateClass: ["nextra-code"],
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
```

and import it on the root `layout.tsx` file

```tsx
export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
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
      </body>
    </html>
  );
}
```

What does it do ?

- it will translate the whole html to target language
- it will deduct the source language based on
  - html lang attribute
- it will deduct target language based on
  - `get-user-locale` package
  - default to `en`
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
    // add overflow break to prevent text overflow, will create multilines
    addOverflowBreak: true,
    skipFitClasses: ["skip-fit"],
    // enable single line spans
    singleLineSpans: true,
  },
  translateConfig: {
    skipTranslateClasses: ["skip-translate"],
    translateFn: translateTextWithGoogle,
    skipTranslateTagNames: [
      "PRE",
      "CODE",
      "TEXTAREA",
      "SELECT",
      "INPUT",
      "SCRIPT",
      "SPAN",
    ],
  },
};
```

And here's the interface for `translateTextWithGoogle` (this is the default), you can easily swap it with your own translation function. Handle the caching using json file remotely or locally, or use our remote translation server for remote cache management, monitoring and centralized translation.

```tsx
export const translateTextWithGoogle = async (params: {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  path: string;
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
    path: string;
    context?: string;
  }) => {
    return "translated text";
  };
};
```
