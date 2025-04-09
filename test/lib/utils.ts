import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const translateFn = async (params: {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}): Promise<string> => {
  return "translated";
};
