import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { m } from "framer-motion";
import { Globe } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  fitAndTranslate,
  translateAndFitToOriginalSize,
} from "runfix-container";

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Shqip" },
  { code: "am", name: "አማርኛ" },
  { code: "ar", name: "العربية" },
  { code: "hy", name: "Հայերեն" },
  { code: "az", name: "Azərbaycan" },
  { code: "eu", name: "Euskara" },
  { code: "be", name: "Беларуская" },
  { code: "bn", name: "বাংলা" },
  { code: "bs", name: "Bosanski" },
  { code: "bg", name: "Български" },
  { code: "my", name: "မြန်မာ" },
  { code: "ca", name: "Català" },
  { code: "ceb", name: "Cebuano" },
  { code: "zh", name: "中文" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "co", name: "Corsu" },
  { code: "hr", name: "Hrvatski" },
  { code: "cs", name: "Čeština" },
  { code: "da", name: "Dansk" },
  { code: "nl", name: "Nederlands" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Eesti" },
  { code: "fi", name: "Suomi" },
  { code: "fr", name: "Français" },
  { code: "fy", name: "Frysk" },
  { code: "gl", name: "Galego" },
  { code: "ka", name: "ქართული" },
  { code: "de", name: "Deutsch" },
  { code: "el", name: "Ελληνικά" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "ht", name: "Kreyòl Ayisyen" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "ʻŌlelo Hawaiʻi" },
  { code: "he", name: "עברית" },
  { code: "hi", name: "हिन्दी" },
  { code: "hmn", name: "Hmong" },
  { code: "hu", name: "Magyar" },
  { code: "is", name: "Íslenska" },
  { code: "ig", name: "Igbo" },
  { code: "id", name: "Indonesia" },
  { code: "ga", name: "Gaeilge" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "jv", name: "Jawa" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "kk", name: "Қазақ" },
  { code: "km", name: "ខ្មែរ" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "ko", name: "한국어" },
  { code: "ku", name: "Kurdî" },
  { code: "ky", name: "Кыргызча" },
  { code: "lo", name: "ລາວ" },
  { code: "la", name: "Latina" },
  { code: "lv", name: "Latviešu" },
  { code: "lt", name: "Lietuvių" },
  { code: "lb", name: "Lëtzebuergesch" },
  { code: "mk", name: "Македонски" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Melayu" },
  { code: "ml", name: "മലയാളം" },
  { code: "mt", name: "Malti" },
  { code: "mi", name: "Māori" },
  { code: "mr", name: "मराठी" },
  { code: "mn", name: "Монгол" },
  { code: "ne", name: "नेपाली" },
  { code: "no", name: "Norsk" },
  { code: "ny", name: "Chichewa" },
  { code: "or", name: "ଓଡ଼ିଆ" },
  { code: "ps", name: "پښتو" },
  { code: "fa", name: "فارسی" },
  { code: "pl", name: "Polski" },
  { code: "pt", name: "Português" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "ro", name: "Română" },
  { code: "ru", name: "Русский" },
  { code: "sm", name: "Gagana Sāmoa" },
  { code: "gd", name: "Gàidhlig" },
  { code: "sr", name: "Српски" },
  { code: "sn", name: "Shona" },
  { code: "sd", name: "سنڌي" },
  { code: "si", name: "සිංහල" },
  { code: "sk", name: "Slovenčina" },
  { code: "sl", name: "Slovenščina" },
  { code: "so", name: "Soomaali" },
  { code: "st", name: "Sesotho" },
  { code: "es", name: "Español" },
  { code: "su", name: "Basa Sunda" },
  { code: "sw", name: "Kiswahili" },
  { code: "sv", name: "Svenska" },
  { code: "tl", name: "Tagalog" },
  { code: "tg", name: "Тоҷикӣ" },
  { code: "ta", name: "தமிழ்" },
  { code: "tt", name: "Татар" },
  { code: "te", name: "తెలుగు" },
  { code: "th", name: "ไทย" },
  { code: "tr", name: "Türkçe" },
  { code: "tk", name: "Türkmen" },
  { code: "uk", name: "Українська" },
  { code: "ur", name: "اردو" },
  { code: "ug", name: "ئۇيغۇر" },
  { code: "uz", name: "O'zbek" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "cy", name: "Cymraeg" },
  { code: "xh", name: "isiXhosa" },
  { code: "yi", name: "יידיש" },
  { code: "yo", name: "Yorùbá" },
  { code: "zu", name: "isiZulu" },
];

// Find Korean language in the list
const defaultLanguage = languages.find((lang) => lang.code === "ko")!;

export function LanguageSelector() {
  const router = useRouter();
  const [items, setItems] = useState<Language[]>(languages.slice(0, 20));
  const [hasMore] = useState(true); // Always true for infinite scroll

  const currentLangCode = (router.query.lang as string) || "ko";
  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) || defaultLanguage;

  const fetchMoreData = () => {
    setTimeout(() => {
      const start = items.length % languages.length;
      const remainingItems = languages.length - start;
      const itemsToAdd = Math.min(20, remainingItems);

      let moreLanguages: Language[] = [];
      if (itemsToAdd < 20) {
        // We need to wrap around to the beginning
        moreLanguages = [
          ...languages.slice(start, start + itemsToAdd),
          ...languages.slice(0, 20 - itemsToAdd),
        ];
      } else {
        moreLanguages = languages.slice(start, start + 20);
      }

      setItems((prevItems) => [...prevItems, ...moreLanguages]);
    }, 500);
  };

  const handleLanguageChange = async (language: Language) => {
    const currentPath = router.asPath.split("?")[0];
    const newUrl =
      language.code === "ko"
        ? currentPath
        : `${currentPath}?lang=${language.code}`;

    window.location.href = newUrl;
  };

  useEffect(() => {
    if (router.isReady) {
      const targetLang = router.query.lang as string;
      if (targetLang) {
        translateAndFitToOriginalSize({
          targetLanguage: targetLang,
          sourceLanguage: "ko",
          fitConfig: {
            addOverflowBreak: true,
          },
        });
      }
    }
  }, [router.isReady, router.query.lang]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <Globe className="w-4 h-4" />
        <span>{currentLanguage.name}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div className="text-center py-2 text-xs text-gray-400">
                Loading...
              </div>
            }
            height={400}
            className="scrollbar-none"
          >
            <div className="p-1">
              {items.map((language) => (
                <DropdownMenu.Item
                  key={language.code}
                  className="flex items-center px-2 py-2 text-sm outline-none cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleLanguageChange(language)}
                >
                  {language.name}
                </DropdownMenu.Item>
              ))}
            </div>
          </InfiniteScroll>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
