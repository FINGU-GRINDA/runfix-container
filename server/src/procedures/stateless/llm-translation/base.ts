export abstract class AbstractLLMTranslate {
	abstract translate(params: {
		sourceText: string;
		sourceLanguage: string;
		targetLanguage: string;
		path: string;
		context?: string;
	}): Promise<string>;

	abstract batchTranslate(params: {
		sourceTexts: string[];
		sourceLanguage: string;
		targetLanguage: string;
		path: Array<string | null>;
		contexts: Array<string | null>;
	}): Promise<string[]>;
}
