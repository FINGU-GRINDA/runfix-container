export const translateTextWithGoogle = async (params: {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}): Promise<string> => {
  if (params.sourceLanguage === params.targetLanguage) {
    return params.text;
  }

  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${
      params.sourceLanguage
    }&tl=${params.targetLanguage}&dt=t&q=${encodeURIComponent(params.text)}`
  );
  const data = await res.json();

  return data[0][0][0];
};
