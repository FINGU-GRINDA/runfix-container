export const getAllElementsToBeTranslated = (params: {
  skipClass: string;
  skipTagNames: string[];
}): HTMLElement[] => {
  if (typeof document === "undefined") throw new Error("Can only run in browser");

  const bodyElement = document.querySelector("body");

  if (!bodyElement) throw new Error("Can't find body element");

  const allElements = Array.from(bodyElement.querySelectorAll("*")).filter((element) => {
    // if it has skip tag name, skip it
    if (params.skipTagNames.includes(element.tagName)) return false;

    // if it has skip class, skip it
    if (element.classList.contains(params.skipClass)) return false;

    // has only text
    const hasOnlyText =
      element.innerHTML === element.textContent && element.textContent?.trim().length > 0;

    // Check for placeholder attribute
    const hasPlaceholder = element.getAttribute("placeholder") !== null;

    if (!hasOnlyText && !hasPlaceholder) return false;

    return true;
  }) as HTMLElement[];

  return allElements;
};
