import { freezeContainerSize } from "../utils/freeze-container-size.ts";
import { getAllElementsToBeTranslated } from "../utils/get-all-elements-to-be-translated.ts";
import { getSortedUniqueContainerWithOverflow } from "../utils/get-unique-container-with-overflow.ts";
import { modifyHTMLLanguage } from "../utils/modify-html-language.ts";
import { textFitterToContainer } from "../utils/text-fitter-to-container.ts";
import { translateElement } from "../utils/translate-element.ts";
import { translateTextWithGoogle } from "../utils/translate-text.ts";
import { DeepPartial, mergeWithDefaults } from "../types/type-utils.ts";
import { waitForDOMLoad } from "../utils/wait-for-DOM-load.ts";

export const translateAndFitToOriginalSizeParams = {
  apiKey: "",
  sourceLanguage: document.documentElement.lang,
  targetLanguage: "ko",
  fitConfig: {
    addOverflowBreak: true,
    skipFitClass: "skip-fit",
  },
  translateConfig: {
    skipTranslateClass: "skip-translate",
    translateFn: translateTextWithGoogle,
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
  const params = mergeWithDefaults(translateAndFitToOriginalSizeParams, userParams);

  await waitForDOMLoad();

  // step 2:
  // get all elements to be translated
  const elementsToTranslate = getAllElementsToBeTranslated({
    skipClass: params.translateConfig.skipTranslateClass,
  });

  // keep record of original containers with overflow
  const originalUniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
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
        translateFn: params.translateConfig.translateFn,
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
      (container: HTMLElement) => !container.classList.contains(params.fitConfig.skipFitClass)
    )
    .filter((container: HTMLElement) => !originalUniqueContainerWithOverflowSet.has(container))
    .map((container: HTMLElement) => {
      if (params.fitConfig.addOverflowBreak) {
        container.style.cssText +=
          ";overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;hyphens: auto;white-space: normal;max-width: 100%;";
      }
      return container;
    });

  // step 7:
  // text fitter
  textFitterToContainer({
    overflowContainers: uniqueContainerWithOverflow,
    minScale: 0,
    maxScale: 99,
    precision: 0.01,
  });

  // check
  // const reUniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
  //   elements: elementsToTranslate,
  // });

  // console.log({ reUniqueContainerWithOverflow });
};
