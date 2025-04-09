import { useEffect } from "react";
import { Square } from "lucide-react";
import { useQueryState } from "nuqs";
import { parseAsBoolean } from "nuqs";

/**
 * Applies or removes border styling from document root element
 * @param showBorder Whether borders should be visible
 */
function applyBorderStyling(showBorder: boolean): void {
  if (showBorder) {
    document.documentElement.classList.add("show-borders");
  } else {
    document.documentElement.classList.remove("show-borders");
  }
}

/**
 * BorderToggle component for toggling border visibility
 * Uses URL query parameter to persist state
 */
export function BorderToggle() {
  // Use nuqs to manage the showBorder state in URL query param
  // This replaces both the local state and URL manipulation logic
  const [borderVisible, setBorderVisible] = useQueryState(
    "showBorder",
    parseAsBoolean.withDefault(false)
  );

  // Apply border styling whenever the border state changes
  useEffect(() => {
    applyBorderStyling(borderVisible);

    // Clean up on unmount
    return () => {
      document.documentElement.classList.remove("show-borders");
    };
  }, [borderVisible]);

  // Function to toggle border visibility
  const toggleBorder = () => {
    setBorderVisible(!borderVisible);
  };

  return (
    <button
      onClick={toggleBorder}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
        borderVisible
          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
      title="Toggle element borders"
    >
      <Square className="w-4 h-4" />
      <span className="">테두리: {borderVisible ? "켜짐" : "꺼짐"}</span>
    </button>
  );
}
