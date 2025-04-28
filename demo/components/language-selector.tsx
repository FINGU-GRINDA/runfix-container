import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Globe } from "lucide-react";
import { useEffect } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { translateAndFit, getGrindaTranslateFn } from "runfix-container";

interface Language {
	code: string;
	name: string;
}

const languages: Language[] = [
	{ code: "zh", name: "中文" }, // China
	{ code: "en", name: "English" }, // USA
	{ code: "id", name: "Indonesia" }, // Indonesia
	{ code: "ja", name: "日本語" }, // Japan
	{ code: "kk", name: "Қазақ" }, // Kazakhstan
	{ code: "ko", name: "한국어" }, // Korea
	{ code: "mn", name: "Монгол" }, // Mongolia
	{ code: "ru", name: "Русский" }, // Russia
	{ code: "th", name: "ไทย" }, // Thailand
	{ code: "uz", name: "O'zbek" }, // Uzbekistan
	{ code: "vi", name: "Tiếng Việt" }, // Vietnam
];

// Find Korean language in the list
const defaultLanguage = languages.find((lang) => lang.code === "ko")!;

export function LanguageSelector() {
	// Use nuqs for query state management
	const [langParam, setLangParam] = useQueryState(
		"lang",
		parseAsString.withDefault("ko"),
	);
	const currentLanguage =
		languages.find((lang) => lang.code === langParam) || defaultLanguage;

	const handleLanguageChange = async (language: Language) => {
		if (!window.document) return;
		// If language is Korean (default), remove the lang parameter
		// Otherwise, set it to the selected language code
		if (language.code === "ko") {
			await setLangParam(null); // Remove the lang parameter from URL
		} else {
			await setLangParam(language.code);
		}
		// Force page refresh to apply the translation
		// This maintains the behavior of the original implementation
	};

	useEffect(() => {
		if (!window.document) return;

		const currentLanguage = document
			.querySelector("html")
			?.getAttribute("lang");
		if (!currentLanguage || !langParam) return;
		if (currentLanguage === langParam) return;

		const startTranslation = async () => {
			await translateAndFit({
				sourceLanguage: currentLanguage,
				targetLanguage: langParam,
				fitConfig: {
					addOverflowBreak: true,
				},
				translateConfig: {
					translateFn: getGrindaTranslateFn({
						apiKey: process.env.NEXT_PUBLIC_GRINDA_TRANSLATE_API_KEY as string,
						baseUrl: process.env
							.NEXT_PUBLIC_GRINDA_TRANSLATE_BASE_URL as string,
					}),
				},
			});

			// Update the html lang attribute
			document.querySelector("html")?.setAttribute("lang", langParam);
		};

		startTranslation();
	}, [langParam]);

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="skip-translate flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
				<Globe className="w-4 h-4" />
				<span className="skip-translate">{currentLanguage.name}</span>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="skip-translate min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg"
					onCloseAutoFocus={(event) => event.preventDefault()}
				>
					<div className="skip-translate max-h-[400px] overflow-y-auto scrollbar-none">
						<div className="p-1">
							{languages.map((language) => (
								<DropdownMenu.Item
									key={language.code}
									className="skip-translate flex items-center px-2 py-2 text-sm outline-none cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700"
									onClick={() => handleLanguageChange(language)}
								>
									{language.name}
								</DropdownMenu.Item>
							))}
						</div>
					</div>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
