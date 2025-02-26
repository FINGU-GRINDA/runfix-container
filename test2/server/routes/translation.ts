import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicProcedure } from "../trpc";
import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";
import { Element, Document } from "domhandler";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define types for translation
interface TranslatableChunk {
  id: string;
  text: string;
  tag: string;
  html: string;
}

interface TranslatedChunk {
  id: string;
  translatedText: string;
  tag: string;
  html: string;
}

// Define the translation response type
export const TranslationResult = z.object({
  language: z.string(),
  translatedText: z.string(),
  originalText: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
});

export async function fetchWebsiteContent(
  url: string
): Promise<{ content: string; html: string }> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://www.google.com/",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
      timeout: 10000,
      maxRedirects: 5,
    });

    if (!response.data) {
      throw new Error("No content received from the website");
    }

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    // Instead, remove only scripts that execute arbitrary code for security
    $("script:not([src])").remove();

    // Get the main content container
    const mainContent = $(
      "main, article, .content, #content, .main, #main"
    ).first();
    const contentContainer = mainContent.length > 0 ? mainContent : $("body");

    return {
      content: contentContainer.text().trim(),
      html: contentContainer.html() || "",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Failed to fetch website content: ${error.response.status} - ${error.response.statusText}`,
        });
      } else if (error.request) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No response received from the website",
        });
      }
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching content",
    });
  }
}
export async function extractTextChunks(
  html: string
): Promise<TranslatableChunk[]> {
  const $ = cheerio.load(html);

  const chunks: TranslatableChunk[] = [];
  $("h1, h2, h3, h4, h5, h6, p, li, span, div").each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();

    if (text && text.length > 0) {
      chunks.push({
        id: `chunk-${chunks.length}`,
        text,
        tag: el.tagName,
        html: $el.html() || "",
      });
    }
  });

  return chunks;
}

export async function translateSingleChunk(
  text: string,
  targetLanguage: string
): Promise<string> {
  try {
    console.log(`🔄 Requesting translation for: ${text}`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a translation assistant. Translate the given text to ${targetLanguage}. Return the result in JSON format with a 'translated_text' field.`,
        },
        {
          role: "user",
          content: `Translate this text to ${targetLanguage} and return as JSON: "${text}"`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    console.log(`✅ OpenAI response:`, completion);

    const messageContent = completion.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error("No translation response received.");
    }

    const result = JSON.parse(messageContent);
    if (!result || typeof result.translated_text !== "string") {
      throw new Error("Invalid translation response format.");
    }

    return result.translated_text;
  } catch (error) {
    console.error("🚨 Translation API Error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Translation failed",
    });
  }
}

export const translationRouter = createRouter({
  fetchContent: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .query(async ({ input }) => {
      const { url } = input;
      return await fetchWebsiteContent(url);
    }),

  translateText: publicProcedure
    .input(
      z.object({
        text: z.string(),
        targetLanguage: z.string(),
        iframeUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { text, targetLanguage } = input;
      const translatedText = await translateSingleChunk(text, targetLanguage);
      return { translatedText };
    }),

  translateChunk: publicProcedure
    .input(
      z.object({
        chunk: z.object({
          id: z.string(),
          text: z.string(),
          tag: z.string(),
          html: z.string(),
        }),
        targetLanguage: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { chunk, targetLanguage } = input;
      const translatedText = await translateSingleChunk(
        chunk.text,
        targetLanguage
      );
      return {
        id: chunk.id,
        translatedText,
        tag: chunk.tag,
        html: chunk.html,
      };
    }),
});
