import { fitText, detectOverflow } from "./utils/fitText.ts";
import { freezeContainerSize } from "./utils/freezeContainerSize.ts";
import { getAllElementsToBeFixed } from "./utils/getAllElementsToBeFixed.ts";
import { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";
import { googleTranslate } from "./utils/googleTranslate.ts";
import { translateElement } from "./utils/translateElement.ts";
import { waitForDOMLoad } from "./utils/waitForDOMLoad.ts";

export { detectOverflow };
export { fitText };
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

  const maybeElementsToFix = getAllElementsToBeFixed({
    elements: elementsToTranslate,
  });

  const elementsToFix = maybeElementsToFix.filter((x) => x !== null);

  freezeContainerSize({ elements: elementsToFix });

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

  // Wait for all translations to complete
  await Promise.all(translationTasks);

  // Finally, fit the text
  fitText({
    elements: elementsToTranslate,
    containerElements: elementsToFix,
    onlyResizeDown: true,
    precision: 0.5,
  });
};
