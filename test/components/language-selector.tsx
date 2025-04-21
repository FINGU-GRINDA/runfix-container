import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Globe } from "lucide-react";
import { useEffect } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { translateAndFit } from "runfix-container";

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
	console.log("rerender");
	useEffect(() => {
		console.log("retranslate");
		if (!window.document) return;

		const sourceLanguage =
			document.querySelector("html")?.getAttribute("lang") || "ko";

		console.log("source language", sourceLanguage, langParam);

		if (sourceLanguage === langParam) return;

		const startTranslation = async () => {
			await translateAndFit({
				sourceLanguage: sourceLanguage,
				targetLanguage: langParam,
				fitConfig: {
					addOverflowBreak: true,
				},
			});

			// Update the html lang attribute
			document.querySelector("html")?.setAttribute("lang", langParam);
			console.log("translated");
		};

		startTranslation();
	}, [langParam]);

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="skip-translate flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
				<Globe className="w-4 h-4" />
				<span className="skip-translate">
					{languages.find((lang) => lang.code === langParam)?.name}
				</span>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg"
					onCloseAutoFocus={(event) => event.preventDefault()}
				>
					<div className="max-h-[400px] overflow-y-auto scrollbar-none">
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
