"use client";

import { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiSettings,
  FiMoon,
  FiSun,
  FiGlobe,
  FiClock,
  FiBell,
} from "react-icons/fi";
import { trpc } from "@/utils/trpc";
import { SettingsPanel } from "@/components/settings-panel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TranslationHistory } from "@/components/translation-history";

const TARGET_LANGUAGES = [
  "English",
  "Japanese",
  "Chinese",
  "Vietnamese",
  "Thai",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Arabic",
  "Hindi",
  "Korean",
  "Dutch",
  "Swedish",
  "Polish",
];

export function TranslationDashboard() {
  const [url, setUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(TARGET_LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("browser");
  const [proxyUrl, setProxyUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");

  // Iframe ref
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // TRPC translation
  const translateTextMutation = trpc.translation.translateText.useMutation();

  // Function to get text nodes from an element
  const getTextNodes = (node: Node): Text[] => {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // Skip script and style tags
        const parentNode = node.parentNode as HTMLElement;
        if (
          parentNode.tagName === "SCRIPT" ||
          parentNode.tagName === "STYLE" ||
          parentNode.tagName === "NOSCRIPT"
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        // Only accept non-empty text nodes
        return node.textContent?.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    let node2;
    while ((node2 = walker.nextNode())) {
      textNodes.push(node2 as Text);
    }
    return textNodes;
  };

  // Batch translation function
  const translateTextNodesParallel = async (node: Node) => {
    const textNodes = getTextNodes(node);
    const totalNodes = textNodes.length;
    let processed = 0; // Counter to track completed translations
    const batchSize = 50; // You can adjust this number based on performance

    for (let i = 0; i < totalNodes; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);

      // Process each node in the batch concurrently
      await Promise.all(
        batch.map(async (textNode) => {
          const originalText = textNode.textContent?.trim();
          if (!originalText) return;

          try {
            // Immediately update the live DOM once translation completes
            const { translatedText } = await translateTextMutation.mutateAsync({
              text: originalText,
              targetLanguage: selectedLanguage,
              iframeUrl: iframeRef.current?.src,
            });
            if (textNode.parentNode) {
              textNode.textContent = translatedText;
            }
          } catch (error) {
            console.error("Translation failed for text node:", error);
          } finally {
            // Update the counter and progress state immediately
            processed++;
            setProgress(Math.min((processed / totalNodes) * 100, 100));
          }
        })
      );
    }
  };

  // Handle translation
  const handleTranslate = async () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) {
      toast.error("Iframe not loaded.");
      return;
    }

    const iframeDoc = iframe.contentWindow.document;
    if (!iframeDoc) {
      toast.error("Cannot access iframe document.");
      return;
    }

    const body = iframeDoc.body;
    if (!body) {
      toast.error("No body element found in iframe.");
      return;
    }

    setIsLoading(true);
    try {
      // Directly update the live body so each text node is translated and updated instantly.
      await translateTextNodesParallel(body);
      toast.success("Translation completed.");
    } catch (error) {
      console.error("Error during translation:", error);
      toast.error("Translation error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle iframe navigation
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeNavigation = () => {
      try {
        // Get the current URL from the iframe
        const currentUrl = new URL(
          iframe.contentWindow?.location.href || ""
        ).searchParams.get("url");

        if (currentUrl && currentUrl !== iframeUrl) {
          setIframeUrl(currentUrl);
        }
      } catch (error) {
        console.error("Failed to get iframe URL:", error);
      }
    };

    iframe.addEventListener("load", handleIframeNavigation);
    return () => iframe.removeEventListener("load", handleIframeNavigation);
  }, [iframeUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrl(websiteUrl);
    try {
      const validated = new URL(websiteUrl);
      setProxyUrl(
        `/api/proxy?url=${encodeURIComponent(
          validated.href
        )}&executeScripts=true`
      );
    } catch {
      toast.error("Invalid URL format");
    }
  };

  // Modify handleIframeLoad to include URL update
  const handleIframeLoad = async () => {
    try {
      await handleTranslate();

      // Additional check for initial load
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow) return;

      const currentProxyUrl = iframeWindow.location.href;
      const urlParams = new URLSearchParams(new URL(currentProxyUrl).search);
      const originalUrl = urlParams.get("url");

      if (originalUrl) {
        const decodedUrl = decodeURIComponent(originalUrl);
        if (decodedUrl !== url) {
          setUrl(decodedUrl);
        }
      }
    } catch (error) {
      console.error("Error in iframe onLoad:", error);
    }
  };
  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              TranslateAI
            </h1>
          </div>
          <nav className="mt-6">
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-left ${
                activeTab === "browser" ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              onClick={() => {
                setActiveTab("browser");
                setShowHistory(false);
                setShowSettings(false);
              }}
            >
              <FiGlobe className="mr-3" />
              Browser Translation
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-left"
              onClick={() => {
                setActiveTab("history");
                setShowHistory(true);
                setShowSettings(false);
              }}
            >
              <FiClock className="mr-3" />
              History
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-left"
              onClick={() => {
                setActiveTab("settings");
                setShowSettings(true);
                setShowHistory(false);
              }}
            >
              <FiSettings className="mr-3" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto py-2 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                    className="mr-4"
                  />
                  {isDarkMode ? (
                    <FiSun className="h-5 w-5 text-gray-200" />
                  ) : (
                    <FiMoon className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="ml-4">
                    <FiBell className="h-5 w-5" />
                  </Button>
                  <Avatar className="ml-4">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>

          {/* Browser Translation */}
          {activeTab === "browser" && (
            <div className="p-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                {/* Browser Top Bar */}
                <div className="border-b p-2 flex items-center gap-2">
                  <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="Enter URL to translate..."
                      className="flex-1 bg-white border rounded-md px-3 py-2"
                    />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="border rounded-md px-3 py-2"
                    >
                      {TARGET_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    {/* Just an icon button, no separate translate action. */}
                    <Button variant="ghost" size="icon">
                      <FiGlobe />
                    </Button>
                  </form>
                </div>

                {/* Website Iframe */}
                {proxyUrl && (
                  <iframe
                    ref={iframeRef}
                    src={proxyUrl}
                    className="w-full h-screen border mt-4"
                    onLoad={handleIframeLoad}
                    sandbox="allow-same-origin allow-forms allow-scripts allow-modals allow-popups allow-downloads allow-top-navigation-by-user-activation"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                )}
              </div>
            </div>
          )}

          {/* Translation History */}
          {activeTab === "history" && showHistory && (
            <div className="p-4">
              <TranslationHistory isOpen={false} setIsOpen={() => null} />
            </div>
          )}

          {/* Settings Panel */}
          {activeTab === "settings" && showSettings && (
            <div className="p-4">
              <SettingsPanel
                isOpen={false}
                setIsOpen={() => null}
                onClose={() => null}
              />
            </div>
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
