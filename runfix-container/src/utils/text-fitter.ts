import { checkElementOverflow } from "./check-element-overflow.ts";

interface TextFitterParams {
  overflowContainers: HTMLElement[];
  minScale?: number;
  maxScale?: number;
  precision?: number;
}

export const textFitter = (params: TextFitterParams) => {
  const { overflowContainers, minScale = 0.1, maxScale = 2.0, precision = 0.01 } = params;

  for (const container of overflowContainers) {
    // check overflow 1st, sometimes overflow is fixed by nested child fixed

    // check if some of child element has overflow
    const hasChildOverflow = Array.from(container.children).some((child) => {
      const overflow = checkElementOverflow({
        element: child as HTMLElement,
      });
      return overflow.hasOverflow;
    });

    if (!hasChildOverflow) continue;

    // get self and all nested children with text content
    const childElementsWithText = [
      container,
      ...Array.from(container.querySelectorAll("*")),
    ].filter((el) => el.textContent !== null);

    let low = minScale;
    let high = maxScale;

    // Store references to DOM elements and their original font sizes
    const elementRefs = childElementsWithText
      .map((domElement) => ({
        domElement, // This is a mutable reference to the actual DOM element
        originalFontSize: Number.parseFloat(window.getComputedStyle(domElement).fontSize),
      }))
      .concat({
        domElement: container,
        originalFontSize: Number.parseFloat(window.getComputedStyle(container).fontSize),
      });

    // Binary search for the optimal scale until it reach the desired precision
    while (high - low > precision) {
      const currentScale = (low + high) / 2;

      // Apply font size scaling to direct children and self
      for (const { domElement, originalFontSize } of elementRefs) {
        (domElement as HTMLElement).style.fontSize = `${originalFontSize * currentScale}px`;
      }

      // Check for overflow
      const hasOverflow = childElementsWithText.some((el) => {
        const overflow = checkElementOverflow({
          element: el as HTMLElement,
        });
        return overflow.hasOverflow;
      });

      if (hasOverflow) {
        // If still overflowing, try a smaller scale
        high = currentScale;
      } else {
        // If not overflowing, this might be our best scale so far
        // Try a larger scale to see if we can do better
        low = currentScale;
      }
    }

    const bestScale = low + precision / 2;

    // Apply the best scale found
    if (bestScale !== 1.0) {
      for (const { domElement, originalFontSize } of elementRefs) {
        (domElement as HTMLElement).style.fontSize = `${originalFontSize * bestScale}px`;
      }
    } else {
      // Reset to original font sizes if no scaling needed
      for (const { domElement, originalFontSize } of elementRefs) {
        (domElement as HTMLElement).style.fontSize = `${originalFontSize}px`;
      }
    }
  }
};
