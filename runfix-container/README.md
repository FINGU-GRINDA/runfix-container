# RUNFIX-CONTAINER

A lightweight browser package that translates your UI content while maintaining the original layout. Uses Google Translate under the hood.

## Features

- 🌐 One-line translation of all UI text
- 🎨 Preserves layout during translation
- 📱 Works with any HTML content
- ⚡ Zero configuration needed
- 🔧 Highly customizable with optional parameters
- 🚫 Skip translation for specific elements
- 🧩 Smart text fitting to prevent overflow

## Installation

```bash
npm install runfix-container
```

## Basic Usage

```javascript
import { fitAndTranslate } from "runfix-container";

// Translate all UI content from English to Spanish
await fitAndTranslate({
  sourceLanguage: "en",
  targetLanguage: "es",
});
```

## Advanced Usage

```javascript
import { fitAndTranslate } from "runfix-container";

// Use all available configuration options
await fitAndTranslate({
  // Language settings
  sourceLanguage: "en",
  targetLanguage: "ja",

  // Custom translation function (optional)
  translateFn: async ({ text, sourceLanguage, targetLanguage }) => {
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
2. Preserves container sizes to prevent layout shifts
3. Translates text using Google Translate (or your custom translation function)
4. Adjusts text size if needed to maintain layout
5. Optionally applies smart word-breaking for long words to prevent overflow

## Language Codes

Use standard language codes (ISO 639-1):

- 'en' for English
- 'es' for Spanish
- 'fr' for French
- 'de' for German
- 'ja' for Japanese
- etc.

## License

MIT
