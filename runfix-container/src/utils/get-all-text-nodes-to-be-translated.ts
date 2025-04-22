export const getAllTextNodesToBeTranslated = (params: {
  elementsWithText: HTMLElement[];
}): Text[] => {
  const allTextNodes: Text[] = [];

  for (const htmlElement of params.elementsWithText) {
    const childNodes = htmlElement.childNodes;

    for (const node of childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      if (!node.textContent) continue;
      if (node.textContent.trim().length === 0) continue;
      allTextNodes.push(node as Text);
    }
  }

  return allTextNodes;
};
