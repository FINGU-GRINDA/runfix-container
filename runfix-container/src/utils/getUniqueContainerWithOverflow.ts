import { checkContainerOverflow } from "./checkContainerOverflow.ts";

export const getSortedUniqueContainerWithOverflow = (params: {
  elements: HTMLElement[];
}): HTMLElement[] => {
  const uniqueContainersWithOverflow = new Set<HTMLElement>();

  // we do checking starting from the child elements to the self to the parent
  for (const element of params.elements) {
    // // get direct child elements
    // const childElements = Array.from(element.children) as HTMLElement[];

    // // check if any of the child elements has overflow
    // for (const child of childElements) {
    //   const overflow = checkContainerOverflow({
    //     container: child,
    //   });

    //   if (overflow.hasOverflow) {
    //     uniqueContainersWithOverflow.add(element);
    //   }
    // }

    const overflow = checkContainerOverflow({
      container: element,
    });

    if (overflow.hasOverflow) {
      uniqueContainersWithOverflow.add(element);
    }

    const parentContainer = element.parentElement;

    if (parentContainer === null || parentContainer.tagName === "BODY") {
      continue;
    }

    const parentOverflow = checkContainerOverflow({
      container: parentContainer,
    });

    if (!parentOverflow.hasOverflow) {
      continue;
    }

    uniqueContainersWithOverflow.add(parentContainer);
  }

  // Convert Set to Array for sorting
  const containersArray = Array.from(uniqueContainersWithOverflow);

  // Calculate depth for each container and sort by depth (deeper elements first)
  const containersWithDepth = containersArray.map((container) => {
    // Calculate the depth of the container in the DOM
    let depth = 0;
    let parent = container.parentElement;
    while (parent) {
      depth++;
      parent = parent.parentElement;
    }

    return { container, depth };
  });

  // Sort by depth in descending order (deeper elements first)
  containersWithDepth.sort((a, b) => b.depth - a.depth);

  // Return just the containers in the sorted order
  return containersWithDepth.map((item) => item.container);
};
