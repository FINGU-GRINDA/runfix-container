export const getAllElementsToBeTranslated = (params: {
  skipClass: string;
  skipTagNames: string[];
}): HTMLElement[] => {
  if (typeof document === "undefined") throw new Error("Can only run in browser");

  const bodyElement = document.querySelector("body");

  if (!bodyElement) throw new Error("Can't find body element");
  const allElements = Array.from(bodyElement.querySelectorAll("*"));

  const allAllowedElements = allElements.filter((element) => {
    // if it has skip tag name, skip it
    if (params.skipTagNames.includes(element.tagName)) return false;

    // if it has skip class, skip it
    if (element.classList.contains(params.skipClass)) return false;

    // Check for placeholder attribute
    const hasPlaceholder = element.getAttribute("placeholder") !== null;

    const hasTextContent = element.textContent !== null;

    if (!hasPlaceholder && !hasTextContent) return false;

    return true;
  });

  return allAllowedElements as HTMLElement[];
};
