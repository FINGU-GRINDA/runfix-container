export const getAllElementsToBeTranslated = (): HTMLElement[] => {
  if (typeof document === "undefined")
    throw new Error("Can only run in browser");

  const bodyElement = document.querySelector("body");
  if (!bodyElement) throw new Error("Can't find body element");

  const allElements = Array.from(bodyElement.querySelectorAll("*")).filter(
    (element) => {
      // Check for direct text content
      const hasDirectText = Array.from(element.childNodes).some(
        (node) =>
          node.nodeType === Node.TEXT_NODE &&
          node.textContent &&
          node.textContent.trim().length > 0
      );
      const hasPlaceholder = element.getAttribute("placeholder") !== null;

      if (!hasDirectText && !hasPlaceholder) return false;

      return true;
    }
  ) as HTMLElement[];

  return allElements;
};
