# RUNFIX-CONTAINER PRD

## 1. Product Overview

### 1.1 Purpose

RUNFIX-CONTAINER is a lightweight browser package designed to provide seamless UI translation while preserving the original layout. It enables developers to add internationalization to any web application with minimal effort, using Google Translate under the hood.

### 1.2 Target Users

- Frontend developers implementing i18n functionality
- Web application teams requiring quick translation capabilities
- UX designers concerned with maintaining consistent layouts across languages
- Businesses looking to expand to international markets without redesigning UI

### 1.3 Business Objectives

- Simplify the implementation of internationalization in web applications
- Eliminate layout shifts and design inconsistencies during translation
- Reduce the need for manual text fitting and translation adjustments
- Enable quick market testing for international audiences
- Provide a developer-friendly solution with minimal configuration

## 2. Technical Architecture

### 2.1 Technology Stack

- **Language**: TypeScript
- **Build Tool**: npm
- **Dependencies**: Minimal external dependencies
- **Translation Backend**: Google Translate (with option for custom providers)
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

### 2.2 System Components

- **Core Translation Module**: Handles text translation requests
- **DOM Traversal Engine**: Identifies and processes translatable content
- **Layout Preservation System**: Maintains UI layout during translation
- **Text Fitting Algorithm**: Adjusts text size and breaks to prevent overflow
- **Customization API**: Allows configuration of translation behavior

### 2.3 External Dependencies

- Google Translate API (unofficial, client=gtx endpoint)
- Optional integration with custom translation services

## 3. Feature Requirements

### 3.1 Core Translation Functionality

#### 3.1.1 Automatic Text Translation

- **Function**: `fitAndTranslate()`
- **Functionality**: Translates all text nodes in the document from source to target language
- **Parameters**:
  - `sourceLanguage`: ISO 639-1 language code (e.g., "en" for English)
  - `targetLanguage`: ISO 639-1 language code for target language
  - `translateConfig`: Optional configuration object
  - `fitConfig`: Optional text fitting configuration

#### 3.1.2 Custom Translation Provider Support

- Allow developers to provide custom translation functions
- Support for alternative translation services
- Fallback mechanism if translation service fails

#### 3.1.3 Element Exclusion

- Skip translation for elements with specified class names
- Skip text fitting for elements where sizing should be preserved

### 3.2 Layout Preservation

#### 3.2.1 Text Fitting Algorithm

- Automatically detect and prevent text overflow
- Adjust font size dynamically based on container dimensions
- Apply word-breaking rules for long translated content
- Preserve original layout structure and spacing

#### 3.2.2 Overflow Handling

- Smart word-break application for long words
- Ellipsis for content that cannot be fitted
- Optional scrolling for content that must be preserved in full

### 3.3 Developer Experience

#### 3.3.1 API Simplicity

- One-line implementation for basic use cases
- Chainable configuration for advanced scenarios
- TypeScript definitions for all public APIs

#### 3.3.2 Documentation

- Comprehensive API documentation
- Usage examples covering common scenarios
- Troubleshooting guide for common issues

## 4. Non-Functional Requirements

### 4.1 Performance

- **Translation Speed**: Minimize visible lag during translation process
- **DOM Impact**: Efficient DOM traversal with minimal reflows
- **Bundle Size**: Keep package under 10KB gzipped
- **Memory Usage**: Optimize for low memory footprint

### 4.2 Reliability

- Graceful handling of translation service failures
- Fallback mechanisms for network issues
- No UI breaking if translation fails

### 4.3 Compatibility

- Support for all modern browsers (last 2 versions)
- Graceful degradation in older browsers
- Mobile browser compatibility

### 4.4 Maintainability

- Modular code architecture with clear separation of concerns
- Comprehensive test suite covering core functionality
- Detailed inline documentation following TypeScript standards
- Following strict function composition guidelines with 100-line maximum per function

## 5. Technical Constraints

### 5.1 API Limitations

- Google Translate unofficial API usage limitations
- Text-only translation (no images or complex elements)
- Limited language support based on Google Translate availability

### 5.2 Browser Limitations

- Cross-origin restrictions for translation API
- Layout preservation challenges with complex CSS
- Font availability for certain languages

## 6. Implementation Plan

### 6.1 Phase 1: Core Translation Engine

- Implement basic translation functionality
- Set up project structure and TypeScript configuration
- Create DOM traversal and text extraction logic

### 6.2 Phase 2: Layout Preservation

- Develop text fitting algorithm
- Implement overflow detection and handling
- Create word-breaking and size adjustment logic

### 6.3 Phase 3: API Refinement

- Finalize public API design
- Add configuration options and customization hooks
- Implement class-based exclusion system

### 6.4 Phase 4: Optimization & Documentation

- Performance optimization
- Documentation and examples
- Test suite development
- Bundle size optimization

## 7. Success Metrics

### 7.1 Technical Metrics

- Translation speed < 300ms for typical page
- No layout shifts during or after translation
- Test coverage > 80%
- Bundle size < 10KB gzipped

### 7.2 Usage Metrics

- Number of npm downloads
- GitHub stars and forks
- Community engagement and issues/pull requests

## 8. Appendix

### 8.1 API Reference

```typescript
interface TranslationConfig {
  // Language settings
  sourceLanguage: string;
  targetLanguage: string;

  // Custom translation function (optional)
  translateFn?: (params: {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<string>;

  // Configuration options
  fitConfig?: {
    addOverflowBreak?: boolean;
    skipFitClass?: string;
  };

  translateConfig?: {
    skipTranslateClass?: string;
  };
}

// Main function
function fitAndTranslate(config: TranslationConfig): Promise<void>;
```

### 8.2 Example Usage Scenarios

#### Basic Website Translation

```javascript
import { fitAndTranslate } from "runfix-container";

// Add language selector to your website
document.getElementById("language-selector").addEventListener("change", async (e) => {
  const targetLanguage = e.target.value;
  await fitAndTranslate({
    sourceLanguage: "en",
    targetLanguage,
  });
});
```

#### E-commerce Product Page

```javascript
import { fitAndTranslate } from "runfix-container";

// Skip translation for prices and product IDs
document.querySelectorAll(".price, .product-id").forEach((el) => {
  el.classList.add("skip-translate");
});

// Translate content while preserving layout
await fitAndTranslate({
  sourceLanguage: "en",
  targetLanguage: "fr",
  fitConfig: {
    addOverflowBreak: true,
  },
});
```

### 8.3 Future Development Roadmap

- Translation memory/caching system
- RTL language support improvements
- Server-side pre-translation option
- Integration with popular i18n frameworks
- React/Vue/Angular dedicated components
