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
  const translatedTo = params.element.getAttribute("data-translated-to");
  if (translatedTo === params.targetLanguage) {
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
      sourceLanguage: params.sourceLanguage,
      targetLanguage: params.targetLanguage,
    });

    params.element.setAttribute("placeholder", translation);
    params.element.setAttribute("data-translated-to", params.targetLanguage);
    return;
  }

  // For other elements, traverse the DOM tree and translate text nodes
  await traverseAndTranslateNodes(params.element, params);

  // Mark the root element as translated
  params.element.setAttribute("data-translated-to", params.targetLanguage);
};

/**
 * Recursively traverses DOM nodes and translates text content
 * while preserving the DOM structure, references, and event listeners
 */
const traverseAndTranslateNodes = async (
  node: HTMLElement,
  params: {
    sourceLanguage: string;
    targetLanguage: string;
    translateFn: (params: {
      sourceText: string;
      sourceLanguage: string;
      targetLanguage: string;
    }) => Promise<string>;
  }
): Promise<void> => {
  // Skip if the element has already been translated to the target language
  if (
    node instanceof HTMLElement &&
    node.getAttribute("data-translated-to") === params.targetLanguage
  ) {
    return;
  }

  // Handle text nodes
  if (node.nodeType === Node.TEXT_NODE && node.textContent) {
    const text = node.textContent.trim();
    if (text.length > 0) {
      const translation = await params.translateFn({
        sourceText: text,
        sourceLanguage: params.sourceLanguage,
        targetLanguage: params.targetLanguage,
      });

      // Preserve whitespace before and after the text
      const leadingWhitespace = node.textContent.match(/^\s*/)?.[0] || "";
      const trailingWhitespace = node.textContent.match(/\s*$/)?.[0] || "";
      node.textContent = leadingWhitespace + translation + trailingWhitespace;
    }
    return;
  }

  // Skip script and style elements
  if (
    node instanceof HTMLElement &&
    (node.tagName.toLowerCase() === "script" || node.tagName.toLowerCase() === "style")
  ) {
    return;
  }

  // Recursively process child nodes
  const childNodes = Array.from(node.childNodes);
  for (const childNode of childNodes) {
    await traverseAndTranslateNodes(childNode as HTMLElement, params);
  }

  // Mark element as translated if it's an HTMLElement
  if (node instanceof HTMLElement) {
    node.setAttribute("data-translated-to", params.targetLanguage);
  }
};
