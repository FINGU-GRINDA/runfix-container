# RUNFIX-CONTAINER

A lightweight browser package that translates your UI content while maintaining the original layout. Uses Google Translate under the hood.

## Why

- Existing translation framework breaks existing layout
- Existing translation framework requires additional and sometimes extensive codebase adjustment
- Decouple translation from development, save developer time
- Business should be able to change / refine translation without touching the codebase

## Technical Features / Roadmap

- [x] Framework agnostic webapp translation
- [x] Works with any HTML content, placeholder, span etc
- [x] Minimum configuration needed, minimal existing codebase adjustment
- [x] Smart group scaled text fitting to prevent overflow
- [x] Use ISO 639-1 language codes (ko, en, ja, etc.)
- [x] Skip translation for specific elements
- [x] Skip text fitting for specific elements
- [x] Bring your own translation function and caching if desired
- [x] Highly customizable with optional parameters
- [x] Support for optional remote translation server, with otel axiom logging, api key management, caching, swagger documentation and translation management
- [ ] Support admin dashboard with organization config, translation history, translation management, api key management and configuration
- [ ] Support for framework specific build time translation

## Installation npm

```bash
npm install runfix-container
```

## Example for react

- using html document lang as source language and url query param `?lang` as target language

```tsx
import { fitAndTranslate, getGrindaTranslateFn } from "runfix-container";

const GRINDA_TRANSLATE_API_KEY = "https://hana-i18n.198.23.164.177.sslip.io";
const GRINDA_TRANSLATE_BASE_URL = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUcmFuc2xhdGlvbiBBUEkiLCJzdWIiOiJ7XCJpZFwiOlwiY205OWx0d3U1MDAwMHVnODZmdmwwNWNpc1wiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTA0LTA5VDA3OjI1OjE0LjIzN1pcIixcInVwZGF0ZWRBdFwiOlwiMjAyNS0wNC0wOVQwNzoyNToxNC4yMzdaXCIsXCJmaXJzdE5hbWVcIjpcInZpa3lcIixcImxhc3ROYW1lXCI6XCJ3XCIsXCJwcm9maWxlUGljdHVyZVwiOm51bGwsXCJyb2xlXCI6XCJVU0VSXCJ9In0.9VYoror4E6TtznQANHehjr4M1ipHGbF2nBuOxySO64Y";

const Page = () => {

  useEffect(() => {
    const currentLanguage = document.documentElement.lang;
    const urlParams = new URLSearchParams(window.location.search);
    const targetLanguage = urlParams.get("lang");

    if (currentLanguage === targetLanguage) {
      // skip translation when current language is the same as target language
      return;
    }
    const startFitAndTranslate = async () => {
      await fitAndTranslate({
        sourceLanguage: currentLanguage,
        targetLanguage: targetLanguage,
        fitConfig: {
          addOverflowBreak: true,
      },
      translateConfig: {
        translateFn: getGrindaTranslateFn({
          apiKey: GRINDA_TRANSLATE_API_KEY,
          baseUrl: GRINDA_TRANSLATE_BASE_URL,
        }),
      },
    });

    // update html document lang since we finished the translation
    document.documentElement.lang = targetLanguage;
  }, []);

  return (
    <div>
      <button onClick={() => setCurrentLanguage("en")}>English</button>
      <button onClick={() => setCurrentLanguage("es")}>Spanish</button>
      <button onClick={() => setCurrentLanguage("fr")}>French</button>
      <button onClick={() => setCurrentLanguage("de")}>German</button>
      <button onClick={() => setCurrentLanguage("ja")}>Japanese</button>
      <div className="skip-translate">This text will not be translated</div>
      <div className="skip-fit">This text will not be resized</div>
      <div className="skip-translate skip-fit">This text will not be translated or resized</div>
      <div>
        This is a documentation for runfix-container.
      </div>
    </div>
  );
};
```

## Installation using script tag for traditional website

```html
<script src="./runfix-container.js"></script>
```

And add this js file in public dir, adjust apiKey and baseUrl accordingly

```js
import {
  translateAndFit,
  getGrindaTranslateFn,
} from "https://cdn.jsdelivr.net/npm/runfix-container/+esm";

// Environment variables
const GRINDA_TRANSLATE_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUcmFuc2xhdGlvbiBBUEkiLCJzdWIiOiJ7XCJpZFwiOlwiY205OWx0d3U1MDAwMHVnODZmdmwwNWNpc1wiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTA0LTA5VDA3OjI1OjE0LjIzN1pcIixcInVwZGF0ZWRBdFwiOlwiMjAyNS0wNC0wOVQwNzoyNToxNC4yMzdaXCIsXCJmaXJzdE5hbWVcIjpcInZpa3lcIixcImxhc3ROYW1lXCI6XCJ3XCIsXCJwcm9maWxlUGljdHVyZVwiOm51bGwsXCJyb2xlXCI6XCJVU0VSXCJ9In0.9VYoror4E6TtznQANHehjr4M1ipHGbF2nBuOxySO64Y";
const GRINDA_TRANSLATE_BASE_URL = "https://hana-i18n.198.23.164.177.sslip.io";

// extract source language from html lang
const currentLanguage = document.documentElement.lang;

// extract target language from url query param
const urlParams = new URLSearchParams(window.location.search);
const targetLanguage = urlParams.get("lang");

// can be adjusted at will to suit your needs, when to trigger the translation
if (targetLanguage !== currentLanguage) {
  console.info(`Translation from ${currentLanguage} to ${targetLanguage} started`);
  await translateAndFit({
    sourceLanguage: currentLanguage,
    targetLanguage: targetLanguage,
    fitConfig: {
      addOverflowBreak: true,
    },
    translateConfig: {
      translateFn: getGrindaTranslateFn({
        apiKey: GRINDA_TRANSLATE_API_KEY,
        baseUrl: GRINDA_TRANSLATE_BASE_URL,
      }),
    },
  });
  console.info(`Translation from ${currentLanguage} to ${targetLanguage} completed`);
  document.documentElement.lang = targetLanguage;
}
```

## Basic Usage Using Google Translate as translation engine

```javascript
import { fitAndTranslate } from "runfix-container";

// Translate all UI content from English to Spanish
await fitAndTranslate({
  sourceLanguage: "en",
  targetLanguage: "es",
});
```

## More Advanced Usage with options

```ts
import { fitAndTranslate } from "runfix-container";

// Use all available configuration options
await fitAndTranslate({
  // Language settings
  sourceLanguage: "en",
  targetLanguage: "ja",

  // Bring your own translation function (optional)
  translateFn: async (params: {
    sourceText: string;
    sourceLanguage: string;
    targetLanguage: string;
    context: string;
  }) => {
    // Your custom translation logic here
    return translatedText;
  },

  // Text fitting configuration
  fitConfig: {
    // Apply word-break and overflow handling
    addOverflowBreak: true,

    // CSS class to skip text fitting
    skipFitClass: "skip-fit",
  },

  // Translation configuration
  translateConfig: {
    // CSS class to skip translation
    skipTranslateClass: "skip-translate",
  },
});
```

## Skipping Elements

Add CSS classes to elements you want to exclude:

```html
<!-- This element will not be translated -->
<div class="skip-translate">Keep this text in original language</div>

<!-- This element will be translated but not resized -->
<div class="skip-fit">Translate but don't resize this text</div>
```

## How it works

1. Automatically detects all text content in your UI
2. Keep track of original overflow elements
3. Traverse the DOM, and translate all text using Google Translate (or your custom translation function)
4. Diff the original overflow elements with the translated elements
5. Adjusts text size for overflown elements from step 4
6. Optionally applies smart word-breaking for long words to prevent overflow

## Language Codes

Use standard language codes (ISO 639-1), here's the currently available languages:

- 'en' for English (USA)
- 'ko' for Korean
- 'ja' for Japanese
- 'zh' for Chinese
- 'uz' for Uzbek (Uzbekistan)
- 'vi' for Vietnamese
- 'ru' for Russian
- 'kk' for Kazakh (Kazakhstan)
- 'mn' for Mongolian (Mongolia)
- 'th' for Thai
- 'id' for Indonesian
- more incoming

## License

MIT
