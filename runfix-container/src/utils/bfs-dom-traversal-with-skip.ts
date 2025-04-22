export const bfsDOMTraversalWithSkip = (params: {
  element: HTMLElement;
  skipClasses: Set<string>;
  skipTags: Set<string>;
}): HTMLElement[] => {
  const { element, skipClasses, skipTags } = params;
  const result: HTMLElement[] = [];
  const queue: HTMLElement[] = [element];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const tagName = current.tagName.toUpperCase();
    const hasSkipClass = Array.from(current.classList).some((cls) => skipClasses.has(cls));
    if (skipTags.has(tagName) || hasSkipClass) {
      continue;
    }
    result.push(current);
    for (const child of Array.from(current.children)) {
      if (child instanceof HTMLElement) {
        queue.push(child);
      }
    }
  }
  return result;
};
