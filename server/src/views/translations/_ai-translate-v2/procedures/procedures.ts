import type { BingResponse } from "./types";

export const batchTranslateTextWithBing = async (params: {
	sourceTexts: string[];
	sourceLanguage: string;
	targetLanguage: string;
	context?: string | null;
}) => {
	const headers = {
		accept: "*/*",
		"accept-language": "ko,en-US;q=0.9,en;q=0.8",
		"cache-control": "no-cache",
		"content-type": "application/json",
		pragma: "no-cache",
		priority: "u=1, i",
		"sec-ch-ua":
			'"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": '"Linux"',
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "cross-site",
		"sec-mesh-client-arch": "x86_64",
		"sec-mesh-client-edge-channel": "stable",
		"sec-mesh-client-edge-version": "135.0.3179.73",
		"sec-mesh-client-os": "Linux",
		"sec-mesh-client-os-version": "6.11.0-24-generic",
		"sec-mesh-client-webview": "0",
		"x-client-data": "CPbwygE=",
		"x-edge-shopping-flag": "1",
	};
	const response = await fetch(
		`https://edge.microsoft.com/translate/translatetext?from=${params.sourceLanguage}&to=${params.targetLanguage}`,
		{
			headers: headers,
			referrer: "https://www.bing.com/",
			referrerPolicy: "origin-when-cross-origin",
			body: JSON.stringify(params.sourceTexts),
			method: "POST",
			mode: "cors",
			credentials: "omit",
		},
	);

	const data: BingResponse = await response.json();

	const translations = data.map((item) => item.translations[0].text);

	return translations;
};
