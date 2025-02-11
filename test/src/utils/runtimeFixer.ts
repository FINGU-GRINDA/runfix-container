const waitForDOMLoad = async (): Promise<void> => {
  // If document is already loaded, resolve immediately
  if (document.readyState === 'complete') {
    return Promise.resolve();
  }

  // Otherwise, wait for the DOM to load
  return new Promise<void>((resolve) => {
    window.addEventListener('load', () => resolve(), { once: true });
  });
};

export const getAllElementsWithDirectTextContent = (): Element[] => {
  if (typeof document === 'undefined')
    throw new Error('Can only run in browser');

  // Get all elements in the document
  const allElements = Array.from(document.querySelectorAll('body *'));

  // Define tags that should be handled at parent level
  const parentLevelTags = [
    'P',
    ...Array.from({ length: 8 }, (_, i) => `H${i + 1}`),
  ];

  // Get elements with either direct text content or placeholder
  const elements = allElements.filter((element) => {
    // Include elements with placeholder attribute
    if (element.hasAttribute('placeholder')) {
      return true;
    }

    // Check for non-empty text content
    const hasText =
      element.childNodes.length > 0 &&
      Array.from(element.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      );

    if (!hasText) return false;

    // For parent-level tags, only include if they have direct text content
    if (parentLevelTags.includes(element.tagName)) {
      return element.parentElement !== null;
    }

    return true;
  });

  return elements;
};

export const freezeContainerSize = async () => {
  await waitForDOMLoad();

  const maybeElements = getAllElementsWithDirectTextContent();

  if (!maybeElements) return;

  maybeElements.forEach((element) => {
    const { width, height } = element.getBoundingClientRect();
    // element.setAttribute('style', `width: 100px; height: 100px;`);
    element.setAttribute('style', `width: ${width}px; height: ${height}px;`);
  });
};

export const fitText = (params: {
  elements: Element[];
  onlyResizeDown?: boolean;
  precision?: number;
  minFontSize?: number;
}) => {
  if (!params.precision) {
    params.precision = 0.001;
  }
  if (!params.minFontSize) {
    params.minFontSize = 1;
  }
  if (!params.onlyResizeDown) {
    params.onlyResizeDown = true;
  }

  const PRECISION = params.precision;
  const MIN_FONT_SIZE = params.minFontSize;
  const ONLY_RESIZE_DOWN = params.onlyResizeDown;

  params.elements.forEach((element) => {
    // Ensure element is HTMLElement
    if (!(element instanceof HTMLElement)) return;

    // Store original styles
    const elementStyles = window.getComputedStyle(element);

    const MAX_FONT_SIZE = ONLY_RESIZE_DOWN
      ? Number(elementStyles.getPropertyValue('font-size').slice(0, -2)) +
        PRECISION
      : 100;

    const container = element.parentElement;
    if (!container) return;

    const isFit = (fontSize: number): boolean => {
      element.style.fontSize = `${fontSize}px`;
      const hasHorizontalOverflow = element.offsetWidth < element.scrollWidth;
      const hasVerticalOverflow = element.offsetHeight < element.scrollHeight;
      return !hasHorizontalOverflow && !hasVerticalOverflow;
    };

    // if fit, do nothing
    // Binary search for the optimal font size
    let low = MIN_FONT_SIZE;
    let high = MAX_FONT_SIZE;

    while (high - low > PRECISION) {
      const mid = (low + high) / 2;
      if (isFit(mid)) {
        low = mid;
      } else {
        high = mid;
      }
    }

    // Apply the found optimal font size
    const optimalSize = low;
    element.style.fontSize = `${optimalSize}px`;
  });
};
