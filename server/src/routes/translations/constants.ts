/**
 * All supported language codes that match the database schema
 *
 * enText String? // English (USA)
 * koText String? // Korean
 * jaText String? // Japanese
 * zhText String? // Chinese
 * uzText String? // Uzbek (Uzbekistan)
 * viText String? // Vietnamese
 * ruText String? // Russian
 * kkText String? // Kazakh (Kazakhstan)
 * mnText String? // Mongolian (Mongolia)
 * thText String? // Thai
 * idText String? // Indonesian
 */
export const allLanguageCodes = [
  "en", // English (USA)
  "ko", // Korean
  "ja", // Japanese
  "zh", // Chinese
  "uz", // Uzbek (Uzbekistan)
  "vi", // Vietnamese
  "ru", // Russian
  "kk", // Kazakh (Kazakhstan)
  "mn", // Mongolian (Mongolia)
  "th", // Thai
  "id", // Indonesian
];

/**
 * Convert a language code to the corresponding database field name
 * @param params Object containing the language code
 * @returns The database field name (e.g., "enText", "koText")
 */
export const languageToDbCode = (params: { languageCode: string }): string => {
  const { languageCode } = params;
  
  // Validate that the language code is supported
  if (!allLanguageCodes.includes(languageCode)) {
    throw new Error(`Unsupported language code: ${languageCode}`);
  }
  
  return `${languageCode}Text`;
};

/**
 * Convert a database field name to the corresponding language code
 * @param params Object containing the database field name
 * @returns The language code (e.g., "en", "ko")
 */
export const dbCodeToLanguage = (params: { dbCode: string }): string => {
  const { dbCode } = params;
  
  // Check if the dbCode ends with "Text"
  if (!dbCode.endsWith("Text")) {
    throw new Error(`Invalid database field name: ${dbCode}`);
  }
  
  // Extract the language code
  const languageCode = dbCode.replace(/Text$/, "");
  
  // Validate that the language code is supported
  if (!allLanguageCodes.includes(languageCode)) {
    throw new Error(`Unsupported language code: ${languageCode}`);
  }
  
  return languageCode;
};
