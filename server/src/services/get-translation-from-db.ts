import { prisma } from "../deps/prisma";
import { languageToDbCode } from "../utils/language-code-to-dbcode";

export const getTranslationFromDB = async (params: {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  userId: string;
}): Promise<string | null> => {
  const dbSourceLanguageCode = languageToDbCode({
    languageCode: params.sourceLanguage,
  });

  const dbTranslation = await prisma.translation.findFirst({
    where: {
      userId: params.userId,
      [dbSourceLanguageCode]: params.sourceText,
    },
  });

  if (!dbTranslation) {
    return null;
  }

  //   convert dbTranslation to json
  const dbTranslationJson = JSON.parse(JSON.stringify(dbTranslation));

  //   check if target language is available
  const targetLanguageKey = languageToDbCode({
    languageCode: params.targetLanguage,
  });

  if (!dbTranslationJson[targetLanguageKey]) {
    return null;
  }

  return dbTranslationJson[targetLanguageKey];
};
