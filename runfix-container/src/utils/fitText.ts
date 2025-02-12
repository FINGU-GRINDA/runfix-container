interface OverflowDetails {
  hasOverflow: boolean;
  totalHeight: number;
  maxWidth: number;
  availableHeight: number;
  availableWidth: number;
  overflowAmount: {
    height: number;
    width: number;
  };
}

interface ContainerDimensions {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const getContainerDimensions = (container: HTMLElement): ContainerDimensions => {
  const containerRect = container.getBoundingClientRect();
  const containerStyle = window.getComputedStyle(container);
  
  return {
    width: containerRect.width,
    height: containerRect.height,
    padding: {
      top: parseFloat(containerStyle.paddingTop) || 0,
      right: parseFloat(containerStyle.paddingRight) || 0,
      bottom: parseFloat(containerStyle.paddingBottom) || 0,
      left: parseFloat(containerStyle.paddingLeft) || 0
    }
  };
};

export const checkOverflow = (container: HTMLElement, textElements: HTMLElement[]): OverflowDetails => {
  const dimensions = getContainerDimensions(container);
  
  // Calculate available space
  const availableWidth = dimensions.width - dimensions.padding.left - dimensions.padding.right;
  const availableHeight = dimensions.height - dimensions.padding.top - dimensions.padding.bottom;

  // Debug log container dimensions
  if (container.style.width === '73.5938px' && container.style.height === '52px') {
    console.group('Container Debug');
    console.log('Container:', {
      width: dimensions.width,
      height: dimensions.height,
      padding: dimensions.padding,
      availableWidth,
      availableHeight,
      style: container.style,
      className: container.className
    });
  }

  // Get the actual content height by measuring the distance between the top of the first element
  // and the bottom of the last element
  let totalHeight = 0;
  if (textElements.length > 0) {
    const firstRect = textElements[0].getBoundingClientRect();
    const lastRect = textElements[textElements.length - 1].getBoundingClientRect();
    totalHeight = lastRect.bottom - firstRect.top;

    // Add margins of first and last elements
    const firstStyle = window.getComputedStyle(textElements[0]);
    const lastStyle = window.getComputedStyle(textElements[textElements.length - 1]);
    totalHeight += parseFloat(firstStyle.marginTop) || 0;
    totalHeight += parseFloat(lastStyle.marginBottom) || 0;

    // Debug log text elements
    if (container.style.width === '73.5938px' && container.style.height === '52px') {
      console.log('Text Elements:', textElements.map(el => ({
        text: el.textContent,
        fontSize: window.getComputedStyle(el).fontSize,
        rect: el.getBoundingClientRect(),
        margins: {
          top: firstStyle.marginTop,
          bottom: lastStyle.marginBottom
        }
      })));
    }
  }

  // Find maximum content width by checking each element's full width
  const maxWidth = Math.max(...textElements.map(el => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const width = rect.width + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);

    // Debug log width calculations
    if (container.style.width === '73.5938px' && container.style.height === '52px') {
      console.log('Element width calc:', {
        element: el.textContent,
        rectWidth: rect.width,
        marginLeft: parseFloat(style.marginLeft) || 0,
        marginRight: parseFloat(style.marginRight) || 0,
        totalWidth: width
      });
    }

    return width;
  }));



  return {
    hasOverflow: totalHeight > availableHeight || maxWidth > availableWidth,
    totalHeight,
    maxWidth,
    availableHeight,
    availableWidth,
    overflowAmount: {
      height: Math.max(0, totalHeight - availableHeight),
      width: Math.max(0, maxWidth - availableWidth)
    }
  };
};

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
const findOverflowContainer = (element: HTMLElement): HTMLElement => {
  const tagName = element.tagName.toLowerCase();

  // Self-contained UI elements that manage their own content boundaries
  const selfContainedElements = new Set([
    'button',      // Button elements
    'input',       // Text inputs, especially type="button"
    'textarea',    // Multiline text inputs
    'select',      // Dropdown menus
    'fieldset',    // Form field groups
    'figure',      // Self-contained content with caption
    'td',          // Table cells
    'th',          // Table header cells
    'li'           // List items
  ]);

  if (selfContainedElements.has(tagName)) {
    return element;
  }

  // Text-like elements that flow with their parent's content
  const textElements = new Set([
    'p',           // Paragraphs
    'h1',          // Headings
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'span',        // Inline text
    'label',       // Form labels
    'a',           // Links
    'em',          // Emphasis
    'strong',      // Strong emphasis
    'i',           // Italic
    'b',           // Bold
    'small',       // Smaller text
    'cite',        // Citations
    'q',           // Inline quotes
    'code',        // Inline code
    'dfn',         // Definitions
    'abbr'         // Abbreviations
  ]);

  // For text elements, use parent as container, otherwise use self
  if (textElements.has(tagName)) {
    const parent = element.parentElement;
    return parent || element; // Fallback to self if no parent
  }

  return element;
};

export const detectOverflow = (element: HTMLElement): OverflowResult => {
  try {
    const container = findOverflowContainer(element);
    
    // Store original styles
    const originalBoxSizing = element.style.boxSizing;
    const originalContainerBoxSizing = container.style.boxSizing;
    const originalPosition = container.style.position;
    const originalOverflow = container.style.overflow;

    // Set box-sizing to border-box and temporarily modify container for accurate measurements
    element.style.boxSizing = 'border-box';
    container.style.boxSizing = 'border-box';
    container.style.position = 'relative';
    container.style.overflow = 'hidden'; // Force container boundaries

    // Get computed styles
    const computedStyle = window.getComputedStyle(container);
    const elementStyle = window.getComputedStyle(element);

    // Get padding and borders
    const isSameElement = element === container;
    const paddingLeft = isSameElement ? 0 : (parseFloat(computedStyle.paddingLeft) || 0);
    const paddingRight = isSameElement ? 0 : (parseFloat(computedStyle.paddingRight) || 0);
    const paddingTop = isSameElement ? 0 : (parseFloat(computedStyle.paddingTop) || 0);
    const paddingBottom = isSameElement ? 0 : (parseFloat(computedStyle.paddingBottom) || 0);
    const borderLeft = isSameElement ? 0 : (parseFloat(computedStyle.borderLeftWidth) || 0);
    const borderRight = isSameElement ? 0 : (parseFloat(computedStyle.borderRightWidth) || 0);
    const borderTop = isSameElement ? 0 : (parseFloat(computedStyle.borderTopWidth) || 0);
    const borderBottom = isSameElement ? 0 : (parseFloat(computedStyle.borderBottomWidth) || 0);

    // Calculate available space in container
    const availableWidth = container.clientWidth - paddingLeft - paddingRight - borderLeft - borderRight;
    const availableHeight = container.clientHeight - paddingTop - paddingBottom - borderTop - borderBottom;

    // Get computed styles for line height and margins
    const computedElementStyle = window.getComputedStyle(element);
    const marginLeft = parseFloat(computedElementStyle.marginLeft) || 0;
    const marginRight = parseFloat(computedElementStyle.marginRight) || 0;
    const marginTop = parseFloat(computedElementStyle.marginTop) || 0;
    const marginBottom = parseFloat(computedElementStyle.marginBottom) || 0;

    // For flex items, we need to check if text is wrapping
    const elementRange = document.createRange();
    elementRange.selectNodeContents(element);
    const elementRect = elementRange.getBoundingClientRect();
    
    // Get the actual content size including margins
    const elementWidth = Math.ceil(elementRect.width + marginLeft + marginRight);
    const elementHeight = Math.ceil(elementRect.height + marginTop + marginBottom);

    // Get scroll dimensions for overflow detection (actual content size)
    const elementScrollWidth = element.scrollWidth + marginLeft + marginRight;
    const elementScrollHeight = element.scrollHeight + marginTop + marginBottom;

    // Calculate overflow using the larger of content size or scroll size
    const actualWidth = Math.max(elementWidth, elementScrollWidth);
    const actualHeight = Math.max(elementHeight, elementScrollHeight);

    // Check for overflow
    const overflowX = actualWidth > availableWidth;
    const overflowY = actualHeight > availableHeight;

    // Calculate overflow amounts
    const overflowAmountX = Math.max(0, actualWidth - availableWidth);
    const overflowAmountY = Math.max(0, actualHeight - availableHeight);

    // Restore original styles
    element.style.boxSizing = originalBoxSizing;
    container.style.boxSizing = originalContainerBoxSizing;
    container.style.position = originalPosition;
    container.style.overflow = originalOverflow;

    return {
      hasOverflow: overflowX || overflowY,
      overflowX,
      overflowY,
      overflowAmount: {
        x: overflowAmountX,
        y: overflowAmountY
      }
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



interface ScaleConfig {
  MIN: number;
  MAX: number;
  PRECISION: number;
  MAX_ITERATIONS: number;
}

interface ElementStyle {
  element: HTMLElement;
  fontSize: number;
  boxSizing: string;
  originalDisplay: string;
}

const DEFAULT_SCALE_CONFIG: ScaleConfig = {
  MIN: 0.1,       // 10% of original size
  MAX: 2.0,       // Allow up to 200% scaling
  PRECISION: 0.05, // 5% precision for faster convergence
  MAX_ITERATIONS: 20
} as const;

const applyScale = (styles: ElementStyle[], scale: number): void => {
  styles.forEach(style => {
    style.element.style.fontSize = `${style.fontSize * scale}px`;
  });
};

const getTextElements = (container: HTMLElement): HTMLElement[] => {
  // Get all text-containing elements recursively
  const elements: HTMLElement[] = [];
  const walk = (node: Node) => {
    if (node instanceof HTMLElement) {
      // Skip if element has no text content
      if (!node.textContent?.trim()) return;
      
      // Add element if it directly contains text
      if (Array.from(node.childNodes).some(child => child.nodeType === Node.TEXT_NODE)) {
        elements.push(node);
      }
    }
    // Recursively check children
    node.childNodes.forEach(walk);
  };
  walk(container);
  return elements;
};

const getOriginalStyles = (elements: HTMLElement[]): ElementStyle[] => {
  return elements.map(el => {
    const style = window.getComputedStyle(el);
    return {
      element: el,
      fontSize: parseFloat(style.fontSize),
      boxSizing: el.style.boxSizing,
      originalDisplay: style.display
    };
  });
};

const findBestScale = ({
  container,
  textElements,
  originalStyles,
  config,
  onlyResizeDown
}: {
  container: HTMLElement;
  textElements: HTMLElement[];
  originalStyles: ElementStyle[];
  config: ScaleConfig;
  onlyResizeDown: boolean;
}): number => {
  // Debug logging for specific container
  const isDebugContainer = container.style.width === '73.5938px' && container.style.height === '52px';
  if (isDebugContainer) {
    console.group('Scale Calculation');
    console.log('Original styles:', originalStyles.map(s => ({
      text: s.element.textContent,
      fontSize: s.fontSize,
      boxSizing: s.boxSizing
    })));
  }
  // Start with max possible scale
  const maxAllowedScale = onlyResizeDown ? 1.0 : config.MAX;
  applyScale(originalStyles, maxAllowedScale);
  
  const initialResult = checkOverflow(container, textElements);
  if (!initialResult.hasOverflow) {
    return maxAllowedScale; // Already fits at max scale
  }

  // Binary search for best scale
  let range = {
    low: config.MIN,
    high: maxAllowedScale
  };
  
  let bestScale = config.MIN;
  let iterations = 0;
  
  while (iterations < config.MAX_ITERATIONS && 
         (range.high - range.low) > config.PRECISION) {
    
    const scale = (range.low + range.high) / 2;
    applyScale(originalStyles, scale);
    
    const result = checkOverflow(container, textElements);
    const overflowRatio = result.totalHeight / result.availableHeight;
    
    // Debug logging for specific container
    if (container.style.width === '73.5938px' && container.style.height === '52px') {
      console.log('Scale attempt:', {
        scale,
        overflowRatio,
        hasOverflow: result.hasOverflow,
        totalHeight: result.totalHeight,
        availableHeight: result.availableHeight,
        range: { low: range.low, high: range.high }
      });
    }
    
    if (result.hasOverflow) {
      // If very close to fitting, make smaller adjustments
      if (overflowRatio < 1.1) {
        range.high = scale;
        range.low = Math.max(config.MIN, scale - config.PRECISION);
      } else {
        range.high = scale;
      }
    } else {
      bestScale = scale;
      // If we have lots of room, try larger jumps
      if (overflowRatio < 0.8) {
        range.low = scale;
        range.high = Math.min(maxAllowedScale, scale + config.PRECISION * 2);
      } else {
        range.low = scale;
      }
    }
    
    iterations++;
  }
  
  return bestScale;
};

export const fitText = (params: {
  elements: HTMLElement[];
  onlyResizeDown?: boolean;
  precision?: number;
  minScale?: number;
  maxScale?: number;
}) => {
  const config: ScaleConfig = {
    ...DEFAULT_SCALE_CONFIG,
    MIN: params.minScale ?? DEFAULT_SCALE_CONFIG.MIN,
    MAX: params.maxScale ?? DEFAULT_SCALE_CONFIG.MAX,
    PRECISION: params.precision ?? DEFAULT_SCALE_CONFIG.PRECISION
  };

  const onlyResizeDown = params.onlyResizeDown !== false; // default to true

  for (const container of params.elements) {
    const textElements = getTextElements(container);
    if (textElements.length === 0) continue;

    const originalStyles = getOriginalStyles(textElements);
    
    const bestScale = findBestScale({
      container,
      textElements,
      originalStyles,
      config,
      onlyResizeDown
    });

    // Apply final scale and restore original box-sizing
    originalStyles.forEach(style => {
      style.element.style.fontSize = `${style.fontSize * bestScale}px`;
      style.element.style.boxSizing = style.boxSizing;
    });
  }
};
