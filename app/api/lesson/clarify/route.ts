import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { context, input, clarification, userId } = await request.json()

    console.log("[v0] Clarify API called with:", { context: context?.length, input: input?.length, clarification: clarification?.length, userId })

    if (!context || !input || !clarification || !userId) {
      console.error("[v0] Missing required fields:", { context: !!context, input: !!input, clarification: !!clarification, userId: !!userId })
      return NextResponse.json({ error: "Context, input, clarification, and userId are required" }, { status: 400 })
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

    // Combine original context with clarification
    const enhancedContext = `${context}\n\nAdditional clarification: ${clarification}`

    const prompt = `You are a Mandarin language tutor helping an advanced learner. The student has provided:

Original Context: ${context}
What they want to say: ${input}
Additional Clarification: ${clarification}

Task: Summarize the user's intent, tone, and context in English in ≤300 tokens using a conversational, 2nd person perspective, incorporating the clarification. Start with "I see that you are trying to..." and end with "Is this correct?". Focus on:
1. The specific situation and cultural context (including the clarification)
2. The exact meaning they want to convey (as clarified)
3. Any nuances, formality levels, or cultural considerations needed

Provide a clear, concise summary of their intent in a conversational tone that incorporates the clarification.`

    console.log("[v0] Calling Gemini with enhanced context for clarification")

    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt,
    })

    console.log("[v0] Gemini clarification response received:", {
      textLength: text?.length || 0,
      textPreview: text?.substring(0, 100) + "...",
    })

    if (!text || text.trim().length === 0) {
      console.error("[v0] Empty response from Gemini")
      return NextResponse.json({ error: "Empty response from AI service" }, { status: 500 })
    }

    return NextResponse.json({
      clarification: text.trim(),
      enhancedContext: enhancedContext,
    })
  } catch (error) {
    console.error("[v0] Error in clarify API:", error)
    return NextResponse.json(
      {
        error: `Failed to process request: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
