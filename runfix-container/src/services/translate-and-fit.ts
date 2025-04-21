import { getSortedUniqueContainerWithOverflow } from "../utils/get-unique-container-with-overflow.ts";
import { textFitter } from "../utils/text-fitter.ts";
import { translateTextWithGoogle } from "../utils/translate-text.ts";
import { mergeWithDefaults } from "../types/type-utils.ts";
import type { DeepPartial } from "../types/type-utils.ts";
import { waitForDOMLoad } from "../utils/wait-for-DOM-load.ts";
import { getAllTextNodesToBeTranslated } from "../utils/get-all-text-nodes-to-be-translated.ts";
import { translateTextNode } from "../utils/translate-text-node.ts";

export const translateAndFitParams = {
  sourceLanguage: "en",
  targetLanguage: "ko",
  fitConfig: {
    addOverflowBreak: true,
    skipFitClass: "skip-fit",
  },
  translateConfig: {
    skipTranslateClass: "skip-translate",
    translateFn: translateTextWithGoogle,
    skipTranslateTagNames: ["PRE", "CODE", "SCRIPT"],
  },
};

// Create the params type with all optional properties
export type TranslateAndFitParams = DeepPartial<typeof translateAndFitParams>;

export const translateAndFit = async (userParams?: TranslateAndFitParams) => {
  // Merge user params with defaults
  const params = mergeWithDefaults(translateAndFitParams, userParams);

  if (params.sourceLanguage === params.targetLanguage) {
    return;
  }

  // Now we can safely use params without null checks since all values have defaults
  await waitForDOMLoad();

  const textNodesToBeTranslated = getAllTextNodesToBeTranslated({
    skipClass: params.translateConfig.skipTranslateClass,
    skipTagNames: params.translateConfig.skipTranslateTagNames,
  });

  // keep record of original containers with overflow
  const originalUniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
    elements: Array.from(document.querySelector("body")?.querySelectorAll("*") || []),
  });

  // Then translate the content
  const translationTasks = [];
  for (const textNode of textNodesToBeTranslated) {
    if (!textNode.textContent) continue;
    translationTasks.push(
      translateTextNode({
        textNode: textNode,
        sourceLanguage: params.sourceLanguage,
        targetLanguage: params.targetLanguage,
        translateFn: params.translateConfig.translateFn,
      })
    );
  }

  await Promise.all(translationTasks);

  // create a set of unique containers with overflow
  const originalUniqueContainerWithOverflowSet = new Set<HTMLElement>(
    originalUniqueContainerWithOverflow
  );

  // narrow down search to elements that we will modify, we won't modify elements that have existing overflow
  const uniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
    elements: Array.from(document.querySelector("body")?.querySelectorAll("*") || []),
  })
    .filter((container: HTMLElement) => !originalUniqueContainerWithOverflowSet.has(container))
    .filter(
      (container: HTMLElement) => !container.classList.contains(params.fitConfig.skipFitClass)
    )
    .filter(
      (container: HTMLElement) =>
        !container.classList.contains(params.translateConfig.skipTranslateClass)
    )
    .filter(
      (container: HTMLElement) =>
        !params.translateConfig.skipTranslateTagNames.includes(container.tagName)
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
