export function getTagSelector(params: { element: HTMLElement }): string {
  // cache it
  if (params.element.hasAttribute("data-tag-selector")) {
    return params.element.getAttribute("data-tag-selector") || "";
  }
  const path: string[] = [];
  let current: HTMLElement | null = params.element;

  while (current) {
    const tagName = current.tagName.toLowerCase();
    path.unshift(tagName);
    current = current.parentElement;
  }

  const tagSelector = path.join(" > ");

  params.element.setAttribute("data-tag-selector", tagSelector);
  return tagSelector;
}
