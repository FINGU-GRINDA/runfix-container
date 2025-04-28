import { useEffect, useCallback } from "react";
import { Square } from "lucide-react";
import { useQueryState } from "nuqs";
import { parseAsBoolean } from "nuqs";
import { checkElementOverflow } from "runfix-container";

/**
 * Applies or removes border styling from document root element and highlights overflow
 * @param showBorder Whether borders should be visible
 */
function applyBorderStyling(showBorder: boolean): void {
	if (showBorder) {
		document.documentElement.classList.add("show-borders");
		// Add CSS for green borders and red overflow
		addBorderAndOverflowStyles();
		// Apply overflow detection
		highlightOverflow();
	} else {
		document.documentElement.classList.remove("show-borders");
		// Remove overflow highlights
		removeOverflowHighlights();
		// Remove the dynamically added styles
		removeBorderAndOverflowStyles();
	}
}

/**
 * Adds CSS styles for green borders and red overflow highlighting
 */
function addBorderAndOverflowStyles(): void {
	// Check if styles are already added
	if (document.getElementById("border-overflow-styles")) return;

	const styleEl = document.createElement("style");
	styleEl.id = "border-overflow-styles";
	styleEl.textContent = `
		.show-borders * {
			outline: 1px solid green !important;
		}
		.overflow-highlight {
			outline: 2px solid red !important;
			outline-offset: -2px;
		}
	`;
	document.head.appendChild(styleEl);
}

/**
 * Removes the dynamically added styles
 */
function removeBorderAndOverflowStyles(): void {
	const styleEl = document.getElementById("border-overflow-styles");
	if (styleEl) {
		document.head.removeChild(styleEl);
	}
}

/**
 * Checks all elements for overflow and highlights them with red borders
 */
function highlightOverflow(): void {
	// Remove existing overflow highlights first
	removeOverflowHighlights();

	// Get all elements except script, style, head, etc.
	const elements = document.querySelectorAll(
		"body *:not(script):not(style):not(link):not(meta):not(head):not(title)",
	);

	// Check each element for overflow
	for (const element of elements) {
		if (element instanceof HTMLElement) {
			const { hasOverflow } = checkElementOverflow({ element });
			if (hasOverflow) {
				element.parentElement?.classList.add("overflow-highlight");
			}
		}
	}
}

/**
 * Removes overflow highlights from all elements
 */
function removeOverflowHighlights(): void {
	const highlightedElements = document.querySelectorAll(".overflow-highlight");
	for (const element of highlightedElements) {
		element.classList.remove("overflow-highlight");
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
		parseAsBoolean.withDefault(false),
	);

	// Apply border styling whenever the border state changes
	useEffect(() => {
		applyBorderStyling(borderVisible);

		// Set up window resize listener to recheck overflow when window size changes
		if (borderVisible) {
			const handleResize = () => {
				highlightOverflow();
			};
			window.addEventListener("resize", handleResize);

			// Clean up on state change or unmount
			return () => {
				window.removeEventListener("resize", handleResize);
				document.documentElement.classList.remove("show-borders");
				removeOverflowHighlights();
				removeBorderAndOverflowStyles();
			};
		}

		// Clean up on unmount if borders are not visible
		return () => {
			document.documentElement.classList.remove("show-borders");
			removeOverflowHighlights();
			removeBorderAndOverflowStyles();
		};
	}, [borderVisible]);

	// Function to toggle border visibility
	const toggleBorder = () => {
		setBorderVisible(!borderVisible);
	};

	return (
		<button
			type="button"
			onClick={toggleBorder}
			className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
				borderVisible
					? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
					: "hover:bg-gray-100 dark:hover:bg-gray-800"
			}`}
			title="Toggle element borders"
		>
			<Square className="w-4 h-4" />
			<span>테두리: {borderVisible ? "켜짐" : "꺼짐"}</span>
		</button>
	);
}
