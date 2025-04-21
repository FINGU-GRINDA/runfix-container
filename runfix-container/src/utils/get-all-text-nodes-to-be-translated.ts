export const getAllTextNodesToBeTranslated = (params: {
  skipClass: string;
  skipTagNames: string[];
}): Text[] => {
  if (typeof document === "undefined") throw new Error("Can only run in browser");

  const bodyElement = document.querySelector("body");

  if (!bodyElement) throw new Error("Can't find body element");

  const allAllowedHtmlElements = Array.from(bodyElement.querySelectorAll("*")).filter((element) => {
    // if it has skip tag name, skip it
    if (params.skipTagNames.includes(element.tagName)) return false;

    if (element.classList.contains(params.skipClass)) return false;
    return true;
  });

  const allHtmlElementsWithText = allAllowedHtmlElements.filter((element) => {
    return element.textContent !== null;
  });

  const allTextNodes: Text[] = [];

  for (const htmlElement of allHtmlElementsWithText) {
    const childNodes = htmlElement.childNodes;

    for (const node of childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        allTextNodes.push(node as Text);
      }
    }
  }

  return allTextNodes;
};
