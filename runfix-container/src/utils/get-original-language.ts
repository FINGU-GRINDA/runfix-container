export const getOriginalLanguage = (): string => {
  const htmlElement = document.querySelector("html");

  if (!htmlElement) {
    throw new Error("No HTML element");
  }

  return htmlElement.getAttribute("lang") || "en";
};
