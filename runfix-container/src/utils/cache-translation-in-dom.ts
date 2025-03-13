export const cacheTranslationInDom = (params: {
  element: HTMLElement;
  language: string;
  translation: string;
}): void => {
  params.element.setAttribute(`data-translation-${params.language}`, params.translation);
};

export const getCachedTranslationInDom = (params: {
  element: HTMLElement;
  language: string;
}): string | null => {
  return params.element.getAttribute(`data-translation-${params.language}`);
};
