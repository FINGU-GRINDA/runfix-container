interface OverflowResult {
  hasOverflow: boolean;
  overflowX: boolean;
  overflowY: boolean;
  overflowAmount: {
    x: number;
    y: number;
  };
}

// this would derive inner height and width of the container (rect minus padding)
// then it would remove the height and width of the element temporarily to check for overflow
// it will start by removing height, and check for y overflow, if no overflow then it will remove width and check for x overflow
export const detectOverflow = (
  element: HTMLElement,
  container: HTMLElement
): OverflowResult => {
  try {
    // Store original styles
    const originalBoxSizing = element.style.boxSizing;
    const originalContainerBoxSizing = container.style.boxSizing;

    // Set box-sizing to border-box for accurate measurements
    element.style.boxSizing = 'border-box';
    container.style.boxSizing = 'border-box';

    // Get computed styles
    const computedStyle = window.getComputedStyle(container);
    const elementStyle = window.getComputedStyle(element);

    // Get padding only if element and container are different
    const isSameElement = element === container;
    const paddingLeft = isSameElement ? 0 : (parseFloat(computedStyle.paddingLeft) || 0);
    const paddingRight = isSameElement ? 0 : (parseFloat(computedStyle.paddingRight) || 0);
    const paddingTop = isSameElement ? 0 : (parseFloat(computedStyle.paddingTop) || 0);
    const paddingBottom = isSameElement ? 0 : (parseFloat(computedStyle.paddingBottom) || 0);

    // Get dimensions
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Calculate available space
    const availableWidth = containerWidth - (paddingLeft + paddingRight);
    const availableHeight = containerHeight - (paddingTop + paddingBottom);

    // Check for scroll overflow
    const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
    const hasVerticalScroll = element.scrollHeight > element.clientHeight;

    // Calculate overflow
    const overflowX = hasHorizontalScroll || elementWidth > availableWidth;
    const overflowY = hasVerticalScroll || elementHeight > availableHeight;

    // Calculate overflow amounts
    const overflowAmountX = Math.max(
      hasHorizontalScroll ? element.scrollWidth - element.clientWidth : 0,
      Math.max(0, elementWidth - availableWidth)
    );
    const overflowAmountY = Math.max(
      hasVerticalScroll ? element.scrollHeight - element.clientHeight : 0,
      Math.max(0, elementHeight - availableHeight)
    );

    // Restore original box-sizing
    element.style.boxSizing = originalBoxSizing;
    container.style.boxSizing = originalContainerBoxSizing;

    return {
      hasOverflow: overflowX || overflowY,
      overflowX,
      overflowY,
      overflowAmount: {
        x: overflowAmountX,
        y: overflowAmountY,
      },
    };
  } catch (error) {
    console.error("Error in detectOverflow:", error);
    return {
      hasOverflow: false,
      overflowX: false,
      overflowY: false,
      overflowAmount: { x: 0, y: 0 },
    };
  }
};

export const fitText = (params: {
  elements: HTMLElement[];
  containerElements: Array<HTMLElement>;
  onlyResizeDown?: boolean;
  precision?: number;
}) => {
  const precision = params.precision || 0.5;
  const onlyResizeDown = params.onlyResizeDown !== false; // default to true

  for (let i = 0; i < params.elements.length; i++) {
    const element = params.elements[i];
    const containerElement = params.containerElements[i];

    // Store original styles
    const originalStyle = window.getComputedStyle(element);
    const originalFontSize = parseFloat(originalStyle.fontSize);
    const originalBoxSizing = element.style.boxSizing;
    const originalContainerBoxSizing = containerElement.style.boxSizing;

    // Set box-sizing to border-box for accurate measurements
    element.style.boxSizing = 'border-box';
    containerElement.style.boxSizing = 'border-box';

    // Check if text already fits at current size
    const initialOverflow = detectOverflow(element, containerElement);
    if (!initialOverflow.hasOverflow) {
      // If text fits and we're only resizing down, keep current size
      if (onlyResizeDown) continue;
    }

    // Set minimum font size to 8px or 50% of original, whichever is larger
    const minFontSize = Math.max(1, originalFontSize * 0.1);

    // Set initial bounds
    let low = Math.max(
      minFontSize,
      initialOverflow.hasOverflow ? minFontSize : originalFontSize
    );
    let high = initialOverflow.hasOverflow
      ? originalFontSize
      : originalFontSize * 2;
    if (onlyResizeDown) {
      high = Math.min(high, originalFontSize);
    }
    let bestFit = initialOverflow.hasOverflow
      ? originalFontSize
      : originalFontSize;

    let iterations = 0;
    const maxIterations = 15; // Increase max iterations for better precision

    while (high - low > precision && iterations < maxIterations) {
      const fontSize = (low + high) / 2;
      element.style.fontSize = `${fontSize}px`;

      const overflowStats = detectOverflow(element, containerElement);
      if (overflowStats.hasOverflow) {
        high = fontSize;
      } else {
        bestFit = fontSize; // Keep track of last known good size
        low = fontSize;
      }
      iterations++;
    }

    // Only update if we found a better size
    if (bestFit !== originalFontSize) {
      element.style.fontSize = `${bestFit}px`;
    }

    // Restore original box-sizing
    element.style.boxSizing = originalBoxSizing;
    containerElement.style.boxSizing = originalContainerBoxSizing;
  }
};
