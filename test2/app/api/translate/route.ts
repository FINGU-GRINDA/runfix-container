import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { text, targetLanguages } = await req.json()

  try {
    const translations = await Promise.all(
      targetLanguages.map(async (lang: string) => {
        const prompt = `Translate the following text to ${lang}:\n\n${text}`
        const { text: translatedText } = await generateText({
          model: openai("gpt-4"),
          prompt: prompt,
        })
        return { language: lang, translation: translatedText }
      }),
    )

    return NextResponse.json({ translations })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}

