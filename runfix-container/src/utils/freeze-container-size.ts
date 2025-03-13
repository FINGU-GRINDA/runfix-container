export const freezeContainerSize = (params: { elements: HTMLElement[] }) => {
  params.elements.forEach((element) => {
    const width = window.getComputedStyle(element).width;
    const height = window.getComputedStyle(element).height;

    element.style.width = width;
    element.style.height = height;
  });
};
