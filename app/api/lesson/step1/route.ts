import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { context, input, userId } = await request.json()

    console.log("[v0] Step1 API called with:", { context: context?.length, input: input?.length, userId })

    if (!context || !input || !userId) {
      console.error("[v0] Missing required fields:", { context: !!context, input: !!input, userId: !!userId })
      return NextResponse.json({ error: "Context, input, and userId are required" }, { status: 400 })
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[v0] Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable")
      return NextResponse.json(
        {
          error:
            "Google AI API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    const prompt = `You are a Mandarin language tutor helping an advanced learner. The student has provided:

Context: ${context}
What they want to say: ${input}

Task: Summarize the user's intent, tone, and context in English in ≤300 tokens. Focus on:
1. The specific situation and cultural context
2. The exact meaning they want to convey
3. Any nuances, formality levels, or cultural considerations needed

Provide a clear, concise summary of their intent.`

    console.log("[v0] Calling Gemini with prompt length:", prompt.length)
    console.log("[v0] Using API key:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "Present" : "Missing")

    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"), // Using the experimental model that should be available
      prompt,
      maxTokens: 300,
    })

    console.log("[v0] Gemini response received:", {
      textLength: text?.length || 0,
      textPreview: text?.substring(0, 100) + "...",
    })

    if (!text || text.trim().length === 0) {
      console.error("[v0] Empty response from Gemini")
      return NextResponse.json({ error: "Empty response from AI service" }, { status: 500 })
    }

    return NextResponse.json({
      clarification: text.trim(),
    })
  } catch (error) {
    console.error("[v0] Error in step1 API:", error)
    return NextResponse.json(
      {
        error: `Failed to process request: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
