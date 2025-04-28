export const singleLineSpan = () => {
  const spans = document.querySelectorAll("span");

  for (const span of spans) {
    span.style.whiteSpace = "nowrap";
  }
};
