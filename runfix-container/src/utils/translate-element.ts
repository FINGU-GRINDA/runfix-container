// DOM-based translation that preserves structure, references, and event listeners
export const translateElement = async (params: {
  element: HTMLElement;
  sourceLanguage: string;
  targetLanguage: string;
  translateFn: (params: {
    sourceText: string;
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<string>;
}): Promise<void> => {
  // Skip if the element has already been translated to the target language
  // we use this instead of params.sourceLanguage because there are times when the source language is not the same as the target language
  const actualSourceLanguage = params.element.getAttribute("data-lang") || params.sourceLanguage;

  if (actualSourceLanguage === params.targetLanguage) {
    return;
  }

  // Handle input and textarea elements with placeholder attributes
  if (params.element instanceof HTMLInputElement || params.element instanceof HTMLTextAreaElement) {
    const sourceText = params.element.getAttribute("placeholder");

    if (!sourceText || sourceText.trim().length === 0) {
      return;
    }

    const translation = await params.translateFn({
      sourceText: sourceText,
      sourceLanguage: actualSourceLanguage,
      targetLanguage: params.targetLanguage,
    });

    params.element.setAttribute("placeholder", translation);
    params.element.setAttribute("data-lang", params.targetLanguage);
    return;
  }

  const translation = await params.translateFn({
    sourceText: params.element.textContent || "",
    sourceLanguage: actualSourceLanguage,
    targetLanguage: params.targetLanguage,
  });

  params.element.textContent = translation;
  params.element.setAttribute("data-lang", params.targetLanguage);
};
