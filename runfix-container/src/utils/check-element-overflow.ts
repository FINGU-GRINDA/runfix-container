interface OverflowStatus {
  hasOverflow: boolean;
  actualContentWidth: number;
  actualContentHeight: number;
  availableWidth: number;
  availableHeight: number;
}

export const checkElementOverflow = (params: { element: HTMLElement }): OverflowStatus => {
  const { element } = params;
  const originalElementStyle = {
    boxSizing: element.style.boxSizing,
    overflow: element.style.overflow,
  };

  // set element properties to be reset after
  element.style.boxSizing = "border-box";
  element.style.overflow = "auto";

  // Calculate overflow
  const overflowX = Math.abs(element.clientWidth - element.scrollWidth);
  const overflowY = Math.abs(element.clientHeight - element.scrollHeight);

  const status: OverflowStatus = {
    hasOverflow: overflowX > 0 || overflowY > 0,
    availableWidth: element.clientWidth,
    availableHeight: element.clientHeight,
    actualContentWidth: element.scrollWidth,
    actualContentHeight: element.scrollHeight,
  };

  // Reset element properties
  element.style.boxSizing = originalElementStyle.boxSizing;
  element.style.overflow = originalElementStyle.overflow;

  return status;
};
