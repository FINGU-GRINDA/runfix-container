import { allLanguageCodes } from "../../../../data/language-codes";

export const isValidLanguageCode = (params: { code: string }): boolean => {
	return allLanguageCodes.includes(params.code);
};
