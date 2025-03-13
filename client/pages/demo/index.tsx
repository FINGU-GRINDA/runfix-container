import { useState } from "react";
import { ellysiaClient } from "@/services/ellysia";
import { parseAsString, useQueryState } from "nuqs";

/**
 * Language option type for dropdown selections
 */
type LanguageOption = {
  code: string;
  name: string;
};

/**
 * Language options available for translation
 */
const languageOptions: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "ja", name: "Japanese" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
];

/**
 * Translation page component
 * Provides a UI for translating text between different languages
 */
export default function Page() {
  // State for form inputs
  const [sourceLanguage, setSourceLanguage] = useQueryState(
    "sourceLanguage",
    parseAsString.withDefault("en")
  );
  const [targetLanguage, setTargetLanguage] = useQueryState(
    "targetLanguage",
    parseAsString.withDefault("ja")
  );
  const [textToTranslate, setTextToTranslate] = useQueryState(
    "textToTranslate",
    parseAsString.withDefault("")
  );
  const [translationResult, setTranslationResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const translationService = ellysiaClient.useMutation(
    "post",
    "/api/translations"
  );

  /**
   * Handles the translation request
   */
  const translateHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await translationService.mutateAsync({
        body: {
          sourceLanguage,
          targetLanguage,
          text: textToTranslate,
        },
      });
      
      if (response) {
        setTranslationResult(response.translatedText);
      }
    } catch (err) {
      console.error("Translation error:", err);
      setError("Failed to translate text. Please try again.");
      setTranslationResult("");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles swapping source and target languages
   */
  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">Translation Tool</h1>
            <p className="text-indigo-100 mt-2">Translate text between multiple languages</p>
          </div>
          
          <div className="p-6">
            {/* Language Selection */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="w-full">
                <label htmlFor="sourceLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                  Source Language
                </label>
                <select
                  id="sourceLanguage"
                  name="sourceLanguage"
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {languageOptions.map((lang) => (
                    <option key={`source-${lang.code}`} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                type="button" 
                onClick={handleSwapLanguages}
                className="flex-shrink-0 p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Swap languages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              
              <div className="w-full">
                <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Language
                </label>
                <select
                  id="targetLanguage"
                  name="targetLanguage"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {languageOptions.map((lang) => (
                    <option key={`target-${lang.code}`} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Text Input */}
            <div className="mb-6">
              <label htmlFor="text-to-translate" className="block text-sm font-medium text-gray-700 mb-1">
                Text to translate
              </label>
              <textarea
                id="text-to-translate"
                name="text-to-translate"
                value={textToTranslate}
                onChange={(e) => setTextToTranslate(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                placeholder="Enter text to translate..."
              />
            </div>
            
            {/* Translate Button */}
            <div className="mb-6">
              <button 
                type="button" 
                onClick={translateHandler}
                disabled={isLoading || !textToTranslate.trim()}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Translating...
                  </span>
                ) : "Translate"}
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {/* Translation Result */}
            {translationResult && (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Translation Result</h3>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-800 whitespace-pre-wrap">{translationResult}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
