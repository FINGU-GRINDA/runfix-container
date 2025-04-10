/**
 * All supported language codes that match the database schema
 * Complete list of ISO 639-1 language codes
 */
export const allLanguageCodes = [
  "aa", // Afar
  "ab", // Abkhazian
  "ae", // Avestan
  "af", // Afrikaans
  "ak", // Akan
  "am", // Amharic
  "an", // Aragonese
  "ar", // Arabic
  "as", // Assamese
  "av", // Avaric
  "ay", // Aymara
  "az", // Azerbaijani
  "ba", // Bashkir
  "be", // Belarusian
  "bg", // Bulgarian
  "bh", // Bihari languages
  "bi", // Bislama
  "bm", // Bambara
  "bn", // Bengali
  "bo", // Tibetan
  "br", // Breton
  "bs", // Bosnian
  "ca", // Catalan
  "ce", // Chechen
  "ch", // Chamorro
  "co", // Corsican
  "cr", // Cree
  "cs", // Czech
  "cu", // Church Slavic
  "cv", // Chuvash
  "cy", // Welsh
  "da", // Danish
  "de", // German
  "dv", // Divehi
  "dz", // Dzongkha
  "ee", // Ewe
  "el", // Greek
  "en", // English
  "eo", // Esperanto
  "es", // Spanish
  "et", // Estonian
  "eu", // Basque
  "fa", // Persian
  "ff", // Fulah
  "fi", // Finnish
  "fj", // Fijian
  "fo", // Faroese
  "fr", // French
  "fy", // Western Frisian
  "ga", // Irish
  "gd", // Gaelic
  "gl", // Galician
  "gn", // Guarani
  "gu", // Gujarati
  "gv", // Manx
  "ha", // Hausa
  "he", // Hebrew
  "hi", // Hindi
  "ho", // Hiri Motu
  "hr", // Croatian
  "ht", // Haitian
  "hu", // Hungarian
  "hy", // Armenian
  "hz", // Herero
  "ia", // Interlingua
  "id", // Indonesian
  "ie", // Interlingue
  "ig", // Igbo
  "ii", // Sichuan Yi
  "ik", // Inupiaq
  "io", // Ido
  "is", // Icelandic
  "it", // Italian
  "iu", // Inuktitut
  "ja", // Japanese
  "jv", // Javanese
  "ka", // Georgian
  "kg", // Kongo
  "ki", // Kikuyu
  "kj", // Kuanyama
  "kk", // Kazakh
  "kl", // Kalaallisut
  "km", // Central Khmer
  "kn", // Kannada
  "ko", // Korean
  "kr", // Kanuri
  "ks", // Kashmiri
  "ku", // Kurdish
  "kv", // Komi
  "kw", // Cornish
  "ky", // Kirghiz
  "la", // Latin
  "lb", // Luxembourgish
  "lg", // Ganda
  "li", // Limburgan
  "ln", // Lingala
  "lo", // Lao
  "lt", // Lithuanian
  "lu", // Luba-Katanga
  "lv", // Latvian
  "mg", // Malagasy
  "mh", // Marshallese
  "mi", // Maori
  "mk", // Macedonian
  "ml", // Malayalam
  "mn", // Mongolian
  "mr", // Marathi
  "ms", // Malay
  "mt", // Maltese
  "my", // Burmese
  "na", // Nauru
  "nb", // Norwegian Bokmål
  "nd", // North Ndebele
  "ne", // Nepali
  "ng", // Ndonga
  "nl", // Dutch
  "nn", // Norwegian Nynorsk
  "no", // Norwegian
  "nr", // South Ndebele
  "nv", // Navajo
  "ny", // Nyanja
  "oc", // Occitan
  "oj", // Ojibwa
  "om", // Oromo
  "or", // Oriya
  "os", // Ossetian
  "pa", // Panjabi
  "pi", // Pali
  "pl", // Polish
  "ps", // Pushto
  "pt", // Portuguese
  "qu", // Quechua
  "rm", // Romansh
  "rn", // Rundi
  "ro", // Romanian
  "ru", // Russian
  "rw", // Kinyarwanda
  "sa", // Sanskrit
  "sc", // Sardinian
  "sd", // Sindhi
  "se", // Northern Sami
  "sg", // Sango
  "si", // Sinhala
  "sk", // Slovak
  "sl", // Slovenian
  "sm", // Samoan
  "sn", // Shona
  "so", // Somali
  "sq", // Albanian
  "sr", // Serbian
  "ss", // Swati
  "st", // Southern Sotho
  "su", // Sundanese
  "sv", // Swedish
  "sw", // Swahili
  "ta", // Tamil
  "te", // Telugu
  "tg", // Tajik
  "th", // Thai
  "ti", // Tigrinya
  "tk", // Turkmen
  "tl", // Tagalog
  "tn", // Tswana
  "to", // Tonga
  "tr", // Turkish
  "ts", // Tsonga
  "tt", // Tatar
  "tw", // Twi
  "ty", // Tahitian
  "ug", // Uighur
  "uk", // Ukrainian
  "ur", // Urdu
  "uz", // Uzbek
  "ve", // Venda
  "vi", // Vietnamese
  "vo", // Volapük
  "wa", // Walloon
  "wo", // Wolof
  "xh", // Xhosa
  "yi", // Yiddish
  "yo", // Yoruba
  "za", // Zhuang
  "zh", // Chinese
  "zu", // Zulu
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
