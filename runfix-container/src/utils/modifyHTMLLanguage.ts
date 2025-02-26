export const modifyHTMLLanguage = (params: { language: string }) => {
  // modify doc language
  const htmlElement = document.querySelector("html");

  if (!htmlElement) {
    throw new Error("No HTML element");
  }

  htmlElement.setAttribute("lang", params.language);
};
