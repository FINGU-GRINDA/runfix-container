interface OverflowStatus {
  hasOverflow: boolean;
  actualContentWidth: number;
  actualContentHeight: number;
  availableWidth: number;
  availableHeight: number;
}

/**
 * Checks if a parent element has overflow content by comparing its content dimensions
 * against its own available space
 * @param container - The parent HTML element to check for overflow
 * @returns Object containing overflow status, dimensions and available space
 */
export const checkContainerOverflow = (params: { container: HTMLElement }): OverflowStatus => {
  const { container } = params;
  const originalContainerStyle = {
    boxSizing: container.style.boxSizing,
    overflow: container.style.overflow,
  };

  // set container properties to be reset after
  container.style.boxSizing = "border-box";
  container.style.overflow = "auto";

  // Calculate overflow
  const overflowX = Math.abs(container.clientWidth - container.scrollWidth);
  const overflowY = Math.abs(container.clientHeight - container.scrollHeight);

  const status: OverflowStatus = {
    hasOverflow: overflowX > 0 || overflowY > 0,
    availableWidth: container.clientWidth,
    availableHeight: container.clientHeight,
    actualContentWidth: container.scrollWidth,
    actualContentHeight: container.scrollHeight,
  };

  // Reset container properties
  container.style.boxSizing = originalContainerStyle.boxSizing;
  container.style.overflow = originalContainerStyle.overflow;

  return status;
};
