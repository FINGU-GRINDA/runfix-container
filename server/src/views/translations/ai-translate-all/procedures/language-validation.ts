import { allLanguageCodes } from "../../constants";

export const isValidLanguageCode = (params: { code: string }): boolean => {
	return allLanguageCodes.includes(params.code);
};
