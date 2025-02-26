import { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";
import { googleTranslate } from "./utils/googleTranslate.ts";
import { translateElement } from "./utils/translateElement.ts";
import { waitForDOMLoad } from "./utils/waitForDOMLoad.ts";
import { textFitter } from "./utils/textFitter.ts";
import { getSortedUniqueContainerWithOverflow } from "./utils/getUniqueContainerWithOverflow.ts";
import { modifyHTMLLanguage } from "./utils/modifyHTMLLanguage.ts";
import { DeepPartial, mergeWithDefaults } from "./utils/typeUtils.ts";
import { freezeContainerSize } from "./utils/freezeContainerSize.ts";
import { textFitterToContainer } from "./utils/textFitterToContainer.ts";
export { checkContainerOverflow } from "./utils/checkContainerOverflow.ts";
export { textFitter } from "./utils/textFitter.ts";
export { getAllElementsToBeTranslated } from "./utils/getAllElementsToBeTranslated.ts";
export { getSortedUniqueContainerWithOverflow } from "./utils/getUniqueContainerWithOverflow.ts";
export { DeepPartial, mergeWithDefaults } from "./utils/typeUtils.ts";

export const fitAndTranslateParams = {
  sourceLanguage: "en",
  targetLanguage: "ko",
  translateFn: googleTranslate,
  fitConfig: {
    addOverflowBreak: true,
    skipFitClass: "skip-fit",
  },
  translateConfig: {
    skipTranslateClass: "skip-translate",
  },
};

// Create the params type with all optional properties
export type FitAndTranslateParams = DeepPartial<typeof fitAndTranslateParams>;

export const fitAndTranslate = async (userParams?: FitAndTranslateParams) => {
  // Merge user params with defaults
  const params = mergeWithDefaults(fitAndTranslateParams, userParams);

  // Now we can safely use params without null checks since all values have defaults
  await waitForDOMLoad();

  const elementsToTranslate = getAllElementsToBeTranslated({
    skipClass: params.translateConfig.skipTranslateClass,
  });

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
    .filter(
      (container: HTMLElement) =>
        !container.classList.contains(params.fitConfig.skipFitClass)
    )
    .map((container: HTMLElement) => {
      if (params.fitConfig.addOverflowBreak) {
        container.style.cssText +=
          ";overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;hyphens: auto;white-space: normal;max-width: 100%;";
      }
      return container;
    });

  textFitter({ overflowContainers: uniqueContainerWithOverflow });
};

export const translateAndFitToOriginalSizeParams = {
  sourceLanguage: "en",
  targetLanguage: "ko",
  translateFn: googleTranslate,
  fitConfig: {
    addOverflowBreak: true,
    skipFitClass: "skip-fit",
  },
  translateConfig: {
    skipTranslateClass: "skip-translate",
  },
};

// Create the params type with all optional properties
export type TranslateAndFitToOriginalSizeParams = DeepPartial<
  typeof translateAndFitToOriginalSizeParams
>;

export const translateAndFitToOriginalSize = async (
  userParams?: TranslateAndFitToOriginalSizeParams
) => {
  // step 1:
  // deepmerge params and default params
  const params = mergeWithDefaults(
    translateAndFitToOriginalSizeParams,
    userParams
  );

  await waitForDOMLoad();

  // step 2:
  // get all elements to be translated
  const elementsToTranslate = getAllElementsToBeTranslated({
    skipClass: params.translateConfig.skipTranslateClass,
  });

  // keep record of original containers with overflow
  const originalUniqueContainerWithOverflow =
    getSortedUniqueContainerWithOverflow({
      elements: elementsToTranslate,
    });

  // create a set of unique containers with overflow
  const originalUniqueContainerWithOverflowSet = new Set<HTMLElement>(
    originalUniqueContainerWithOverflow
  );
  // step 3:
  // freeze all container size
  freezeContainerSize({ elements: elementsToTranslate });

  // step 4:
  // translate the content
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

  // step 5:
  // modify the language
  modifyHTMLLanguage({ language: params.targetLanguage });

  // step 6:
  // get all container with overflow
  // narrow down search to elements that we will modify, we won't modify elements that have existing overflow
  const uniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
    elements: elementsToTranslate,
  })
    .filter(
      (container: HTMLElement) =>
        !container.classList.contains(params.fitConfig.skipFitClass)
    )
    .filter(
      (container: HTMLElement) =>
        !originalUniqueContainerWithOverflowSet.has(container)
    )
    .map((container: HTMLElement) => {
      if (params.fitConfig.addOverflowBreak) {
        container.style.cssText +=
          ";overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;hyphens: auto;white-space: normal;max-width: 100%;";
      }
      return container;
    });

  console.log({ uniqueContainerWithOverflow });

  // step 7:
  // text fitter
  textFitterToContainer({
    overflowContainers: uniqueContainerWithOverflow,
    minScale: 0,
    maxScale: 99,
    precision: 0.01,
  });

  // check
  const reUniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
    elements: elementsToTranslate,
  });

  console.log({ reUniqueContainerWithOverflow });
};
