export const getGrindaTranslateFn = (params: { apiKey: string; baseUrl: string }) => {
  return async (translateParams: {
    sourceText: string;
    sourceLanguage: string;
    targetLanguage: string;
    context?: string;
  }): Promise<string> => {
    const response = await fetch(
      `${params.baseUrl}/api/translations?sourceText=${translateParams.sourceText}&sourceLanguage=${translateParams.sourceLanguage}&targetLanguage=${translateParams.targetLanguage}`,
      {
        headers: {
          "Api-Key": params.apiKey,
        },
      }
    );

    const data = await response.json();
    return data.translatedText;
  };
};
