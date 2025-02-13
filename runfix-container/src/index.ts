import { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";
import { googleTranslate } from "./utils/googleTranslate.ts";
import { translateElement } from "./utils/translateElement.ts";
import { waitForDOMLoad } from "./utils/waitForDOMLoad.ts";
import { checkContainerOverflow } from "./utils/checkContainerOverflow.ts";
import { textFitter } from "./utils/textFitter.ts";
import { getUniqueContainerWithOverflow } from "./utils/getUniqueContainerWithOverflow.ts";
export { checkContainerOverflow } from "./utils/checkContainerOverflow.ts";
export { textFitter } from "./utils/textFitter.ts";
export { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";
export { getUniqueContainerWithOverflow } from "./utils/getUniqueContainerWithOverflow.ts";

export const fitAndTranslate = async (params: {
  targetLanguage: string;
  sourceLanguage: string;
  translateFn?: (params: {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<string>;
}) => {
  if (!params.translateFn) {
    params.translateFn = googleTranslate;
  }

  await waitForDOMLoad();

  const elementsToTranslate = getAllElementsToBeTranslated();

  // narrow down search to elements that we will modify
  const originalUniqueContainerWithOverflow = getUniqueContainerWithOverflow({
    elements: elementsToTranslate,
  });

  // Then translate the content
  const translationTasks = [];
  for (const element of elementsToTranslate) {
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

  const uniqueContainerWithOverflow = Array.from(
    getUniqueContainerWithOverflow({
      elements: elementsToTranslate,
    })
  ).filter((container) => !originalUniqueContainerWithOverflow.has(container));

  console.log({ uniqueContainerWithOverflow });
  textFitter({ overflowContainers: uniqueContainerWithOverflow });
};
