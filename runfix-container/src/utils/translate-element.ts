import { getTagSelector } from "./get-tag-selector";

// DOM-based translation that preserves structure, references, and event listeners
export const translateElement = async (params: {
  element: HTMLElement;
  sourceLanguage: string;
  targetLanguage: string;
  translateFn: (params: {
    sourceText: string;
    sourceLanguage: string;
    targetLanguage: string;
    path: string;
    context?: string;
  }) => Promise<string>;
}): Promise<void> => {
  // Skip if the element has already been translated to the target language
  // we use this instead of params.sourceLanguage because there are times when the source language is not the same as the target language
  const actualSourceLanguage = params.element.getAttribute("data-lang") || params.sourceLanguage;

  if (actualSourceLanguage === params.targetLanguage) {
    return;
  }

  const tagSelector = getTagSelector({ element: params.element });

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
      path: tagSelector,
    });

    params.element.setAttribute("placeholder", translation);
    params.element.setAttribute("data-lang", params.targetLanguage);
    return;
  }

  // handle element with text content
  const childNodes = params.element.childNodes;

  const textNodes: Text[] = [];
  for (const childNode of childNodes) {
    if (childNode.nodeType !== Node.TEXT_NODE) continue;
    if (!childNode.textContent) continue;
    if (childNode.textContent.trim().length === 0) continue;
    textNodes.push(childNode as Text);
  }

  // translate text nodes
  const translationPromises: Promise<string>[] = [];

  const context = params.element.textContent || undefined;

  for (const textNode of textNodes) {
    translationPromises.push(
      params.translateFn({
        sourceText: textNode.textContent as string,
        sourceLanguage: actualSourceLanguage,
        targetLanguage: params.targetLanguage,
        path: tagSelector,
        context: context,
      })
    );
  }

  const translations = await Promise.all(translationPromises);

  for (let i = 0; i < textNodes.length; i++) {
    textNodes[i].textContent = translations[i];
  }

  // for caching, sometimes ui interaction happens before translations are finished
  params.element.setAttribute("data-lang", params.targetLanguage);
};
