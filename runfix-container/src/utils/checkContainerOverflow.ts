interface OverflowStatus {
  hasOverflow: boolean;
  overflowX: number;
  overflowY: number;
  availableWidth: number;
  availableHeight: number;
}

/**
 * Checks if a parent element has overflow content by comparing its content dimensions
 * against its own available space
 * @param container - The parent HTML element to check for overflow
 * @returns Object containing overflow status, dimensions and available space
 */
export const checkContainerOverflow = (params: {
  container: HTMLElement;
}): OverflowStatus => {
  const { container } = params;
  const computedStyle = window.getComputedStyle(container);

  // Get container's box model measurements
  const padding = {
    left: parseFloat(computedStyle.paddingLeft) || 0,
    right: parseFloat(computedStyle.paddingRight) || 0,
    top: parseFloat(computedStyle.paddingTop) || 0,
    bottom: parseFloat(computedStyle.paddingBottom) || 0,
  };

  const borders = {
    left: parseFloat(computedStyle.borderLeftWidth) || 0,
    right: parseFloat(computedStyle.borderRightWidth) || 0,
    top: parseFloat(computedStyle.borderTopWidth) || 0,
    bottom: parseFloat(computedStyle.borderBottomWidth) || 0,
  };

  // Get container's available space (content box)
  const availableWidth = container.clientWidth - padding.left - padding.right;
  const availableHeight = container.clientHeight - padding.top - padding.bottom;

  // Get actual content size (scrollWidth/Height includes overflow)
  const totalContentWidth =
    container.scrollWidth - padding.left - padding.right;
  const totalContentHeight =
    container.scrollHeight - padding.top - padding.bottom;

  // Calculate overflow
  const overflowX = Math.max(0, totalContentWidth - availableWidth);
  const overflowY = Math.max(0, totalContentHeight - availableHeight);

  const status: OverflowStatus = {
    hasOverflow: overflowX > 0 || overflowY > 0,
    overflowX,
    overflowY,
    availableWidth,
    availableHeight,
  };

  return status;
};
