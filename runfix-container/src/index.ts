import { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";
import { googleTranslate } from "./utils/googleTranslate.ts";
import { translateElement } from "./utils/translateElement.ts";
import { waitForDOMLoad } from "./utils/waitForDOMLoad.ts";
import { checkContainerOverflow } from "./utils/checkContainerOverflow.ts";
import { textFitter } from "./utils/textFitter.ts";
export { checkContainerOverflow } from "./utils/checkContainerOverflow.ts";
export { textFitter } from "./utils/textFitter.ts";
export { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";

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

  const uniqueContainerWithOverflow = elementsToTranslate.reduce(
    (acc, element) => {
      const parent = element.parentElement;
      if (parent === null) return acc;
      if (parent.tagName === "BODY") return acc;
      const overflow = checkContainerOverflow({ container: parent });
      if (overflow.hasOverflow) {
        acc.add(parent);
      }
      return acc;
    },
    new Set<HTMLElement>()
  );

  const uniqueContainersWithOverflowArr = Array.from(
    uniqueContainerWithOverflow
  );
  console.log({ uniqueContainerWithOverflow, uniqueContainersWithOverflowArr });
  textFitter({ overflowContainers: uniqueContainersWithOverflowArr });
};
