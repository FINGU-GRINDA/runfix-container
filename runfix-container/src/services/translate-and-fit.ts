import { getSortedUniqueContainerWithOverflow } from "../utils/get-unique-container-with-overflow.ts";
import { textFitter } from "../utils/text-fitter.ts";
import { translateTextWithGoogle } from "../utils/translate-text.ts";
import { mergeWithDefaults } from "../types/type-utils.ts";
import type { DeepPartial } from "../types/type-utils.ts";
import { waitForDOMLoad } from "../utils/wait-for-DOM-load.ts";
import { getAllElementsToBeTranslated } from "../utils/get-all-elements-to-be-translated.ts";
import { singleLineSpan } from "../utils/single-line-span.ts";
import { translateAllElements } from "../utils/translate-all-elements.ts";

export const translateAndFitParams = {
  sourceLanguage: "en",
  targetLanguage: "ko",
  fitConfig: {
    addOverflowBreak: false,
    skipFitClasses: ["skip-fit"],
    singleLineSpans: true,
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

  // keep record of original containers with overflow
  // limit search scope to elements that we will translate
  const originalUniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
    elements: allElementsToBeTranslated,
  });

  await translateAllElements({
    elements: allElementsToBeTranslated,
    sourceLanguage: params.sourceLanguage,
    targetLanguage: params.targetLanguage,
    translateFn: params.translateConfig.translateFn,
  });

  if (params.fitConfig.singleLineSpans) {
    singleLineSpan();
  }

  // create a set of unique containers with overflow
  const originalUniqueContainerWithOverflowSet = new Set<HTMLElement>(
    originalUniqueContainerWithOverflow
  );

  const parsedSkipFitClasses = new Set(params.fitConfig.skipFitClasses);

  // narrow down search to elements that we will modify, we won't modify elements that have existing overflow
  const uniqueContainerWithOverflow = getSortedUniqueContainerWithOverflow({
    elements: allElementsToBeTranslated,
  })
    .map((container: HTMLElement) => {
      if (params.fitConfig.addOverflowBreak) {
        container.style.cssText +=
          ";overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;hyphens: auto;white-space: normal;max-width: 100%;";
      }
      return container;
    })
    .filter((container: HTMLElement) => {
      if (originalUniqueContainerWithOverflowSet.has(container)) return false;

      if (Array.from(container.classList).some((cls) => parsedSkipFitClasses.has(cls)))
        return false;
      return true;
    });

  textFitter({ overflowContainers: uniqueContainerWithOverflow });
};
