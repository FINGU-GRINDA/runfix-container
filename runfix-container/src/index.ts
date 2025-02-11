interface TextFitOptions {
  width?: number;
  height?: number;
  minFontSize?: number;
  maxFontSize?: number;
  multiLine?: boolean;
}

/**
 * Prepares an element for text fitting by setting its dimensions and styles
 * @param element The element to prepare
 * @param options Configuration options
 */
export const prepareForTextFit = (element: HTMLElement, options: TextFitOptions = {}): void => {
  const {
    width = element.offsetWidth || 100,
    height = element.offsetHeight || 20,
    multiLine = false
  } = options;

  // Set core dimensions
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.display = 'inline-block';

  // Set overflow handling
  element.style.overflow = 'hidden';
  if (!multiLine) {
    element.style.textOverflow = 'ellipsis';
    element.style.whiteSpace = 'nowrap';
  }
};

/**
 * Gets all elements that have direct text content (not just child elements with text)
 * @returns {Element[]} Array of elements with direct text content
 */
export const getElementsWithTextContent = (): Element[] => {
  if (typeof window === "undefined") return [];

  const body = document.querySelector("body");
  if (!body) return [];

  return Array.from(body.querySelectorAll("*")).filter((element) => {
    return Array.from(element.childNodes).some(
      (node) =>
        node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== ""
    );
  });
};

/**
 * Applies text fitting to an element, ensuring it has proper dimensions first
 * @param element The element to fit text into
 * @param options Configuration options
 */
export const fitText = async (element: HTMLElement, options: TextFitOptions = {}): Promise<void> => {
  if (typeof window === "undefined") return;

  // Prepare the element
  prepareForTextFit(element, options);

  // Wait for next frame to ensure styles are applied
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      // Force a reflow
      void element.getBoundingClientRect();
      resolve();
    });
  });

  // Run textFit with appropriate options
  const textFitOptions = {
    multiLine: options.multiLine ?? false,
    detectMultiLine: options.multiLine ?? false,
    minFontSize: options.minFontSize ?? 6,
    maxFontSize: options.maxFontSize ?? 20
  };

  // @ts-ignore - textFit is imported globally
  if (typeof textFit === 'function') {
    // @ts-ignore - textFit is imported globally
    textFit(element, textFitOptions);
  }
};
