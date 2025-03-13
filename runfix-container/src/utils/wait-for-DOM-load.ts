export const waitForDOMLoad = async (): Promise<void> => {
  // If document is already loaded, resolve immediately
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  // Otherwise, wait for the DOM to load
  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
};
