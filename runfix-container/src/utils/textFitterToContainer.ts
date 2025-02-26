import { checkContainerOverflow } from "./checkContainerOverflow.ts";

interface TextFitterToContainerParams {
  overflowContainers: HTMLElement[];
  minScale?: number;
  maxScale?: number;
  precision?: number;
}

export const textFitterToContainer = (params: TextFitterToContainerParams) => {
  // step 1:

  for (const container of params.overflowContainers) {
    // recheck for overflow
    const overflow = checkContainerOverflow({
      container,
    });

    if (!overflow.hasOverflow) continue;

    let low = params.minScale ?? 0;
    let high = params.maxScale ?? 99;
    let hasOverflow = true;

    // Get direct children and store their original font sizes
    const children = Array.from(container.children) as HTMLElement[];

    // Store references to DOM elements and their original font sizes
    const elementRefs = children
      .map((domElement) => ({
        domElement, // This is a mutable reference to the actual DOM element
        originalFontSize: parseFloat(
          window.getComputedStyle(domElement).fontSize
        ),
      }))
      .concat({
        domElement: container,
        originalFontSize: parseFloat(
          window.getComputedStyle(container).fontSize
        ),
      });

    // Binary search for the optimal scale until it reach the desired precision
    while (high - low > (params.precision ?? 0.01)) {
      const currentScale = (low + high) / 2;

      // Apply font size scaling to direct children and self
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
        low = currentScale;
        hasOverflow = false;
      }
    }

    const bestScale = low;

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
