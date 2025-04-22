# Browser Installation

## Installation

And add this js file in public dir, adjust apiKey and baseUrl accordingly

```js
import {
  translateAndFit,
  getGrindaTranslateFn,
} from "https://cdn.jsdelivr.net/npm/runfix-container/+esm";

// Environment variables
const GRINDA_TRANSLATE_API_KEY = "your api key";
const GRINDA_TRANSLATE_BASE_URL = "https://api.hanalangconnect.site";

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

and import it on the main html

```html
<script src="./runfix-container.js"></script>
```