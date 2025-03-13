import { getAllElementsToBeTranslated } from "../utils/get-all-elements-to-be-translated.ts";
import { getSortedUniqueContainerWithOverflow } from "../utils/get-unique-container-with-overflow.ts";
import { modifyHTMLLanguage } from "../utils/modify-html-language.ts";
import { textFitter } from "../utils/text-fitter.ts";
import { translateElement } from "../utils/translate-element.ts";
import { translateTextWithGoogle } from "../utils/translate-text.ts";
import { DeepPartial, mergeWithDefaults } from "../types/type-utils.ts";
import { waitForDOMLoad } from "../utils/wait-for-DOM-load.ts";

export const translateAndFitParams = {
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
export type TranslateAndFitParams = DeepPartial<typeof translateAndFitParams>;

export const translateAndFit = async (userParams?: TranslateAndFitParams) => {
  // Merge user params with defaults
  const params = mergeWithDefaults(translateAndFitParams, userParams);

  // Now we can safely use params without null checks since all values have defaults
  await waitForDOMLoad();

  const elementsToTranslate = getAllElementsToBeTranslated({
    skipClass: params.translateConfig.skipTranslateClass,
  });

  // keep record of original containers with overflow
  const originalUniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
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
        translateFn: params.translateConfig.translateFn,
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
    .filter((container: HTMLElement) => !originalUniqueContainerWithOverflowSet.has(container))
    .filter(
      (container: HTMLElement) => !container.classList.contains(params.fitConfig.skipFitClass)
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
