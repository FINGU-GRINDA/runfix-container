import { getSortedUniqueContainerWithOverflow } from "../utils/get-unique-container-with-overflow.ts";
import { textFitter } from "../utils/text-fitter.ts";
import { translateTextWithGoogle } from "../utils/translate-text.ts";
import { mergeWithDefaults } from "../types/type-utils.ts";
import type { DeepPartial } from "../types/type-utils.ts";
import { waitForDOMLoad } from "../utils/wait-for-DOM-load.ts";
import { getAllTextNodesToBeTranslated } from "../utils/get-all-text-nodes-to-be-translated.ts";
import { translateTextNode } from "../utils/translate-text-node.ts";
import { getAllElementsToBeTranslated } from "../utils/get-all-elements-to-be-translated.ts";

export const translateAndFitParams = {
  sourceLanguage: "en",
  targetLanguage: "ko",
  fitConfig: {
    addOverflowBreak: true,
    skipFitClasses: ["skip-fit"],
  },
  translateConfig: {
    skipTranslateClasses: ["skip-translate"],
    translateFn: translateTextWithGoogle,
    skipTranslateTagNames: ["PRE", "CODE", "SCRIPT", "SVG", "PATH"],
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
  const parsedSkipTagNames = new Set(
    params.translateConfig.skipTranslateTagNames.map((tag) => tag.toUpperCase())
  );
  const parsedSkipClasses = new Set(
    params.translateConfig.skipTranslateClasses.map((cls) => cls.toUpperCase())
  );

  const allElementsToBeTranslated = getAllElementsToBeTranslated({
    skipClasses: parsedSkipClasses,
    skipTagNames: parsedSkipTagNames,
  });

  const textNodesToBeTranslated = getAllTextNodesToBeTranslated({
    elementsWithText: allElementsToBeTranslated,
  });

  // keep record of original containers with overflow
  // limit search scope to elements that we will translate
  const originalUniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
    elements: allElementsToBeTranslated,
  });

  // Then translate the content
  const translationTasks = [];
  for (const textNode of textNodesToBeTranslated) {
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
    elements: allElementsToBeTranslated,
  })
    .filter((container: HTMLElement) => {
      if (originalUniqueContainerWithOverflowSet.has(container)) return false;
      if (params.fitConfig.skipFitClasses.some((cls) => container.classList.contains(cls)))
        return false;
      if (
        params.translateConfig.skipTranslateClasses.some((cls) => container.classList.contains(cls))
      )
        return false;
      if (
        params.translateConfig.skipTranslateTagNames.some(
          (tagName) => container.tagName === tagName.toUpperCase()
        )
      )
        return false;
      return true;
    })
    .map((container: HTMLElement) => {
      if (params.fitConfig.addOverflowBreak) {
        container.style.cssText +=
          ";overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;hyphens: auto;white-space: normal;max-width: 100%;";
      }
      return container;
    });

  textFitter({ overflowContainers: uniqueContainerWithOverflow });
};
