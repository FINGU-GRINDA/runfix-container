import { checkContainerOverflow } from "./checkContainerOverflow.ts";

export const getUniqueContainerWithOverflow = (params: {
  elements: HTMLElement[];
}): Set<HTMLElement> => {
  const uniqueContainersWithOverflow = new Set<HTMLElement>();

  for (const element of params.elements) {
    // const parentContainer = element.parentElement;

    // if (parentContainer === null || parentContainer.tagName === "BODY") {
    //   continue;
    // }

    // const parentOverflow = checkContainerOverflow({
    //   container: parentContainer,
    // });

    // if (!parentOverflow.hasOverflow) {
    //   continue;
    // }

    // uniqueContainersWithOverflow.add(parentContainer);

    const overflow = checkContainerOverflow({
      container: element,
    });

    if (overflow.hasOverflow) {
      uniqueContainersWithOverflow.add(element);
      continue;
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

  return uniqueContainersWithOverflow;
};
