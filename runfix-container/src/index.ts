import { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";
import { googleTranslate } from "./utils/googleTranslate.ts";
import { translateElement } from "./utils/translateElement.ts";
import { waitForDOMLoad } from "./utils/waitForDOMLoad.ts";
import { textFitter } from "./utils/textFitter.ts";
import { getSortedUniqueContainerWithOverflow } from "./utils/getUniqueContainerWithOverflow.ts";
import { modifyHTMLLanguage } from "./utils/modifyHTMLLanguage.ts";
export { checkContainerOverflow } from "./utils/checkContainerOverflow.ts";
export { textFitter } from "./utils/textFitter.ts";
export { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";
export { getSortedUniqueContainerWithOverflow } from "./utils/getUniqueContainerWithOverflow.ts";

export const fitAndTranslate = async (params: {
  targetLanguage: string;
  sourceLanguage: string;
  translateFn?: (params: {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<string>;
  fitConfig?: {
    addOverflowBreak?: boolean;
  };
}) => {
  if (!params.translateFn) {
    params.translateFn = googleTranslate;
  }

  if (!params.fitConfig) {
    params.fitConfig = {};
  }

  if (!params.fitConfig?.addOverflowBreak) {
    params.fitConfig.addOverflowBreak = false;
  }

  await waitForDOMLoad();

  const elementsToTranslate = getAllElementsToBeTranslated();

  // keep record of original containers with overflow
  const originalUniqueContainerWithOverflow =
    getSortedUniqueContainerWithOverflow({
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

  modifyHTMLLanguage({ language: params.targetLanguage });

  // create a set of unique containers with overflow
  const originalUniqueContainerWithOverflowSet = new Set<HTMLElement>(
    originalUniqueContainerWithOverflow
  );

  // narrow down search to elements that we will modify, we won't modify elements that have existing overflow
  const uniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
    elements: elementsToTranslate,
  })
    .filter(
      (container: HTMLElement) =>
        !originalUniqueContainerWithOverflowSet.has(container)
    )
    .map((container: HTMLElement) => {
      if (params.fitConfig?.addOverflowBreak) {
        container.style.cssText +=
          ";overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;hyphens: auto;white-space: normal;max-width: 100%;";
      }
      return container;
    });

  textFitter({ overflowContainers: uniqueContainerWithOverflow });
};
