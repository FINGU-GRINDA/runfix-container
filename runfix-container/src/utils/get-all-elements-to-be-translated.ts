import { bfsDOMTraversalWithSkip } from "./bfs-dom-traversal-with-skip";

export const getAllElementsToBeTranslated = (params: {
  skipClasses: Set<string>;
  skipTagNames: Set<string>;
}): HTMLElement[] => {
  if (typeof document === "undefined") throw new Error("Can only run in browser");

  const bodyElement = document.querySelector("body");

  if (!bodyElement) throw new Error("Can't find body element");

  const allElements = bfsDOMTraversalWithSkip({
    element: bodyElement,
    skipClasses: params.skipClasses,
    skipTags: params.skipTagNames,
  });

  const allAllowedElements = allElements.filter((element) => {
    // Check for placeholder attribute
    const hasPlaceholder = element.getAttribute("placeholder") !== null;

    const hasTextContent = element.textContent !== null;

    if (!hasPlaceholder && !hasTextContent) return false;

    return true;
  });

  return allAllowedElements as HTMLElement[];
};
