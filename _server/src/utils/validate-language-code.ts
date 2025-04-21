import { allLanguageCodes } from "../routes/translations/constants";

export const isValidLanguageCode = (params: { code: string }): boolean => {
  return allLanguageCodes.includes(params.code);
};
