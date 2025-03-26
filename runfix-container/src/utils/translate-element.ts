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
    const sourceText = params.element.getAttribute("placeholder");

    if (!sourceText || sourceText.trim().length === 0) {
      return;
    }

    const translation = await params.translateFn({
      text: sourceText as string,
      sourceLanguage: params.sourceLanguage,
      targetLanguage: params.targetLanguage,
    });

    params.element.setAttribute("placeholder", translation);
    return;
  }

  // if doesn't have a placeholder, just translate the text content while maintaining the structure
  // Split HTML into text and tags
  // TODO: traverse the html instead of recreating it
  const parts = params.element.innerHTML.split(/(<[^>]*>)/);

  const translatedParts = await Promise.all(
    parts.map(async (part) => {
      // If it's a tag (starts with < and ends with >), keep it as is
      if (part.startsWith("<") && part.endsWith(">")) {
        return part;
      }

      // If it's text content and not empty, translate it
      const textToTranslate = part.trim();
      if (textToTranslate.length > 0) {
        const translation = await params.translateFn({
          text: textToTranslate,
          sourceLanguage: params.sourceLanguage,
          targetLanguage: params.targetLanguage,
        });

        return translation;
      }
      // If it's empty or whitespace, keep it as is
      return part;
    })
  );

  params.element.innerHTML = translatedParts.join("");
};
