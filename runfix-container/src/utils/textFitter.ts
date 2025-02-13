import { checkContainerOverflow } from "./checkContainerOverflow.ts";

interface TextFitterParams {
  overflowContainers: HTMLElement[];
  minScale?: number;
  maxScale?: number;
  precision?: number;
}

export const textFitter = (params: TextFitterParams) => {
  const {
    overflowContainers,
    minScale = 0.1,
    maxScale = 2.0,
    precision = 0.01,
  } = params;

  for (const container of overflowContainers) {
    let low = minScale;
    let high = maxScale;
    let bestScale = minScale;
    let hasOverflow = true;

    // Get direct children and store their original font sizes
    const children = Array.from(container.children) as HTMLElement[];
    // Store references to DOM elements and their original font sizes
    const elementRefs = children.map((domElement) => ({
      domElement, // This is a mutable reference to the actual DOM element
      originalFontSize: parseFloat(
        window.getComputedStyle(domElement).fontSize
      ),
    }));

    // Binary search for the optimal scale
    while (high - low > precision) {
      const currentScale = (low + high) / 2;

      // Apply font size scaling to direct children
      elementRefs.forEach(({ domElement, originalFontSize }) => {
        domElement.style.fontSize = `${originalFontSize * currentScale}px`;
      });

      // Check for overflow
      const { hasOverflow: overflow } = checkContainerOverflow({ container });

      if (overflow) {
        // If still overflowing, try a smaller scale
        high = currentScale;
      } else {
        // If not overflowing, this might be our best scale so far
        // Try a larger scale to see if we can do better
        bestScale = currentScale;
        low = currentScale;
        hasOverflow = false;
      }
    }

    // Apply the best scale found
    if (bestScale !== 1.0) {
      elementRefs.forEach(({ domElement, originalFontSize }) => {
        domElement.style.fontSize = `${originalFontSize * bestScale}px`;
      });
    } else {
      // Reset to original font sizes if no scaling needed
      elementRefs.forEach(({ domElement, originalFontSize }) => {
        domElement.style.fontSize = `${originalFontSize}px`;
      });
    }
  }
};
