// get parent elements that needs to be fixed, go 1 parent higher if the parent is h, span, p
const isTextElement = (element: HTMLElement): boolean => {
  const textTags = new Set([
    'P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'ARTICLE', 'A', 'LABEL', 'DIV'
  ]);
  return textTags.has(element.tagName);
};

const findCommonTextContainer = (element: HTMLElement): HTMLElement => {
  let current = element;
  let parent = element.parentElement;

  // Walk up until we find a parent that has multiple text children
  // or until we hit a self-contained component
  while (parent) {
    const siblings = Array.from(parent.children) as HTMLElement[];
    const textSiblings = siblings.filter(isTextElement);

    // If this parent contains multiple text elements, it's our target
    if (textSiblings.length > 1) {
      return parent;
    }

    // If this is a component boundary, stop here
    if (parent.hasAttribute('data-component') || 
        parent.classList.contains('component')) {
      return current;
    }

    current = parent;
    parent = parent.parentElement;
  }

  return current;
};

export const getAllElementsToBeFixed = (params: {
  elements: HTMLElement[];
}): Array<HTMLElement> => {
  const containers = new Set<HTMLElement>();
  
  for (const element of params.elements) {
    const container = findCommonTextContainer(element);
    containers.add(container);
  }

  return Array.from(containers);
};
