export const languageToDbCode = (params: { languageCode: string }) => {
  //  TODO: db code example en -> enText, ja -> jaText
  return `${params.languageCode.toLocaleLowerCase()}Text`;
};

export const dbCodeToLanguage = (params: { dbCode: string }) => {
  //  TODO: db code example en -> enText, ja -> jaText
  return params.dbCode.replace("Text", "").toLocaleLowerCase();
};
