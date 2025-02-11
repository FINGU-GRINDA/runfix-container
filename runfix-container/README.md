# RUNFIX-CONTAINER

A lightweight browser package that translates your UI content while maintaining the original layout. Uses Google Translate under the hood.

## Features

- 🌐 One-line translation of all UI text
- 🎨 Preserves layout during translation
- 📱 Works with any HTML content
- ⚡ Zero configuration needed

## Installation

```bash
npm install runfix-container
```

## Usage

```javascript
import { fitAndTranslate } from 'runfix-container';

// Translate all UI content from English to Spanish
await fitAndTranslate({
  sourceLanguage: 'en',
  targetLanguage: 'es'
});
```

## How it works

1. Automatically detects all text content in your UI
2. Preserves container sizes to prevent layout shifts
3. Translates text using Google Translate
4. Adjusts text size if needed to maintain layout

## Language Codes

Use standard language codes like:
- 'en' for English
- 'es' for Spanish
- 'fr' for French
- 'de' for German
- 'ja' for Japanese
- etc.

## License

MIT
