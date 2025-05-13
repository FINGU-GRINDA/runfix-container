import { translateElement } from "./translate-element.ts";

export const translateAllElements = async (params: {
  elements: HTMLElement[];
  sourceLanguage: string;
  targetLanguage: string;
  translateFn: (params: {
    sourceText: string;
    sourceLanguage: string;
    targetLanguage: string;
    path: string;
  }) => Promise<string>;
}) => {
  // translate all elements asynchronously
  const translationTasks = [];
  for (const element of params.elements) {
    translationTasks.push(
      translateElement({
        element: element,
        sourceLanguage: params.sourceLanguage,
        targetLanguage: params.targetLanguage,
        translateFn: params.translateFn,
      })
    );
  }

  await Promise.all(translationTasks);
};
