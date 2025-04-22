export const translateTextWithGoogle = async (params: {
	sourceText: string;
	sourceLanguage: string;
	targetLanguage: string;
	context?: string;
}): Promise<string | undefined> => {
	if (params.sourceLanguage === params.targetLanguage) {
		return params.sourceText;
	}

	try {
		const res = await fetch(
			`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${
				params.sourceLanguage
			}&tl=${params.targetLanguage}&dt=t&q=${encodeURIComponent(
				params.sourceText,
			)}`,
		);

		const data = await res.json();

		return data[0][0][0];
	} catch (error) {
		console.error(error);
		return undefined;
	}
};
