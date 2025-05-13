export const revertToOriginalFontSizes = (params: { elements: HTMLElement[] }) => {
  for (const element of params.elements) {
    const originalFontSize = element.getAttribute("data-original-font-size");
    if (originalFontSize) {
      element.style.fontSize = originalFontSize;
      continue;
    }

    const computedFontSize = window.getComputedStyle(element).fontSize;
    element.setAttribute("data-original-font-size", computedFontSize);
  }
};
