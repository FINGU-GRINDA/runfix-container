import { useState } from "react";
import {
  getAllElementsToBeTranslated,
  checkContainerOverflow,
  getUniqueContainerWithOverflow,
} from "runfix-container";

export function OverflowDetector() {
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [overflowCount, setOverflowCount] = useState(0);

  const toggleHighlights = () => {
    if (isHighlighting) {
      // Remove highlights
      document.querySelectorAll(".overflow-highlight").forEach((el) => {
        el.classList.remove("overflow-highlight");
      });
      setIsHighlighting(false);
      setOverflowCount(0);
    } else {
      // Add highlights
      let elementsToBeTranslated = getAllElementsToBeTranslated();

      const uniqueContainersWithOverflow = Array.from(
        getUniqueContainerWithOverflow({
          elements: elementsToBeTranslated,
        })
      );

      let highlightCount = 0;

      uniqueContainersWithOverflow.forEach((element) => {
        element.classList.add("overflow-highlight");
        highlightCount++;
      });

      console.log(`Found ${highlightCount} overflow elements`);
      setIsHighlighting(true);
      setOverflowCount(highlightCount);
    }
  };

  return (
    <div className="fixed top-0 right-0 z-50">
      <button
        onClick={toggleHighlights}
        className="bg-black text-white hover:bg-black/90 px-4 py-2 m-4 rounded-md shadow-md transition-colors w-[180px] flex items-center justify-center text-sm"
      >
        <span className="inline-flex items-center gap-2 w-[120px] justify-center whitespace-nowrap">
          {isHighlighting ? "Hide" : "Show"}
          {overflowCount > 0 && (
            <span className="inline-flex items-center justify-center bg-white text-black rounded-full min-w-[20px] h-5 px-1 text-xs font-medium">
              {overflowCount}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
