export const translateTextWithGoogle = async (params: {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}): Promise<string> => {
  if (params.sourceLanguage === params.targetLanguage) {
    return params.sourceText;
  }

  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${
      params.sourceLanguage
    }&tl=${params.targetLanguage}&dt=t&q=${encodeURIComponent(params.sourceText)}`
  );
  const data = await res.json();

  return data[0][0][0];
};

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
