export const bfsDOMTraversalWithSkip = (params: {
  element: HTMLElement;
  skipClasses: Set<string>;
  skipTags: Set<string>;
}): HTMLElement[] => {
  const { element, skipClasses, skipTags } = params;
  const result: HTMLElement[] = [];

  // More efficient queue implementation with pointers
  const queue: HTMLElement[] = [element];
  let head = 0;

  while (head < queue.length) {
    const current = queue[head++]; // Dequeue without shifting
    if (!current) continue;

    const hasSkipClass = Array.from(current.classList).some((cls) =>
      skipClasses.has(cls.toUpperCase())
    );
    if (hasSkipClass) {
      current.setAttribute("data-skip-translate", "skip-class");
      continue;
    }

    const tagName = current.tagName.toUpperCase();
    if (skipTags.has(tagName)) {
      current.setAttribute("data-skip-translate", "skip-tag");
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
