import { cacheTranslationInDom, getCachedTranslationInDom } from "./cache-translation-in-dom.ts";

// Simple text-based HTML translation that preserves structure
export const translateElement = async (params: {
  element: HTMLElement;
  sourceLanguage: string;
  targetLanguage: string;
  translateFn: (params: {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<string>;
}): Promise<void> => {
  // translate placeholder
  if (params.element instanceof HTMLInputElement || params.element instanceof HTMLTextAreaElement) {
    const translation = await params.translateFn({
      text: params.element.placeholder,
      sourceLanguage: params.sourceLanguage,
      targetLanguage: params.targetLanguage,
    });
    params.element.setAttribute("placeholder", translation);
    return;
  }

  // if doesn't have a placeholder, just translate the text content while maintaining the structure
  // Split HTML into text and tags
  const parts = params.element.innerHTML.split(/(<[^>]*>)/);
  const translatedParts = await Promise.all(
    parts.map(async (part) => {
      // If it's a tag (starts with < and ends with >), keep it as is
      if (part.startsWith("<") && part.endsWith(">")) {
        // if there's a placeholder, translate it
        return part;
      }

      // If it's text content and not empty, translate it
      const textToTranslate = part.trim();
      if (textToTranslate.length > 0) {
        // check if there's cached translation in DOM
        const cachedTranslation = getCachedTranslationInDom({
          element: params.element,
          language: params.targetLanguage,
        });

        if (cachedTranslation) {
          return cachedTranslation;
        }

        // if none, we will store original text in DOM

        cacheTranslationInDom({
          element: params.element,
          language: params.sourceLanguage,
          translation: textToTranslate,
        });

        const translation = await params.translateFn({
          text: textToTranslate,
          sourceLanguage: params.sourceLanguage,
          targetLanguage: params.targetLanguage,
        });

        cacheTranslationInDom({
          element: params.element,
          language: params.targetLanguage,
          translation,
        });

        return translation;
      }
      // If it's empty or whitespace, keep it as is
      return part;
    })
  );

  params.element.innerHTML = translatedParts.join("");
};
