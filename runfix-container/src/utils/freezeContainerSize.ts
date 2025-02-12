export const freezeContainerSize = (params: { elements: HTMLElement[] }) => {
  params.elements.forEach((element) => {
    const { width, height } = element.getBoundingClientRect();
    element.style.setProperty("width", `${width}px`);
    element.style.setProperty("height", `${height}px`);
  });
};
