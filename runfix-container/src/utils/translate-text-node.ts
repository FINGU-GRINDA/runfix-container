export const translateTextNode = async (params: {
  textNode: Text;
  sourceLanguage: string;
  targetLanguage: string;
  translateFn: (params: {
    sourceText: string;
    sourceLanguage: string;
    targetLanguage: string;
    context?: string;
  }) => Promise<string>;
}) => {
  if (!params.textNode.textContent) return;
  if (params.textNode.textContent.trim().length === 0) return;
  if (params.sourceLanguage === params.targetLanguage) return;

  const translation = await params.translateFn({
    sourceText: params.textNode.textContent,
    sourceLanguage: params.sourceLanguage,
    targetLanguage: params.targetLanguage,
    context: params.textNode.textContent,
  });
  console.table({
    sourceLanguage: params.sourceLanguage,
    targetLanguage: params.targetLanguage,
    sourceText: params.textNode.textContent,
    translation: translation,
  });
  params.textNode.textContent = translation;
};
