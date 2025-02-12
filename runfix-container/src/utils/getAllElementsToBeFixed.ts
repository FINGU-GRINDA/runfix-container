// get parent elements that needs to be fixed, go 1 parent higher if the parent is h, span, p
export const getAllElementsToBeFixed = (params: {
  elements: HTMLElement[];
}): Array<HTMLElement> => {
  const targetElements = params.elements.map((element) => {
    let targetElement: HTMLElement | null = element;
    while (
      targetElement &&
      (targetElement.tagName === "P" ||
        targetElement.tagName === "SPAN" ||
        targetElement.tagName === "H1" ||
        targetElement.tagName === "H2" ||
        targetElement.tagName === "H3" ||
        targetElement.tagName === "H4" ||
        targetElement.tagName === "H5" ||
        targetElement.tagName === "H6" ||
        targetElement.tagName === "ARTICLE")
    ) {
      targetElement = targetElement.parentElement;
    }
    return targetElement ?? element;
  });

  return targetElements;
};
