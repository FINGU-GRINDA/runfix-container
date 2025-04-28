export function getTagSelector(params: { element: HTMLElement }): string {
  const path: string[] = [];
  let current: HTMLElement | null = params.element;

  while (current) {
    const tagName = current.tagName.toLowerCase();
    const siblings = Array.from(current.parentElement?.children || []);
    const sameTagSiblings = siblings.filter((sibling) => sibling.tagName === current?.tagName);

    if (sameTagSiblings.length > 1) {
      const index = sameTagSiblings.indexOf(current) + 1;
      path.unshift(`${tagName}:nth-of-type(${index})`);
    } else {
      path.unshift(tagName);
    }

    current = current.parentElement;
  }

  return path.join(" > ");
}
