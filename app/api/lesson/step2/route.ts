import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { context, input, confirmed, clarification, userId, originalClarification } = await request.json()

    console.log("[v0] Step2 API called with:", { context, input, confirmed, clarification, userId })

    if (!context || !input || !userId) {
      return NextResponse.json({ error: "Context, input, and userId are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const step2UpdateData: any = {
      step2_clarification: originalClarification,
      step2_user_confirmation: confirmed,
    }

    if (!confirmed && clarification) {
      step2UpdateData.step2_user_clarification = clarification
    }

    const { error: step2Error } = await supabase
      .from("lessons")
      .update(step2UpdateData)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (step2Error) {
      console.error("Database update error:", step2Error)
      return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
    }

    const finalIntent = confirmed ? input : clarification
    console.log("[v0] Final intent for Gemini:", finalIntent)

    const prompt = `You are an expert Mandarin language tutor. A student wants to express the following:

Context: ${context}
Intent: ${finalIntent}

Generate corrections and alternatives following these requirements:
1. CORRECTED: The correct Mandarin translation (keep original nouns intact when possible) with pinyin
2. NOTES: Brief explanation of mistakes, ambiguities, grammar, and cultural context (2-3 sentences)
3. ALTERNATIVE1: A different phrasing with pinyin
4. ALTERNATIVE1_NOTES: Explanation of grammar/vocab choices for this alternative (1-2 sentences)
5. ALTERNATIVE2: Another alternative phrasing with pinyin  
6. ALTERNATIVE2_NOTES: Explanation of grammar/vocab choices for this alternative (1-2 sentences)

Format your response as JSON:
{
  "corrected": "Mandarin text (pinyin)",
  "notes": "explanation of mistakes and corrections",
  "alternative1": "alternative version (pinyin)",
  "alternative1_notes": "grammar/vocab explanation",
  "alternative2": "alternative version (pinyin)",
  "alternative2_notes": "grammar/vocab explanation"
}`

    console.log("[v0] Calling Gemini with prompt length:", prompt.length)

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
      maxTokens: 800,
    })

    console.log("[v0] Gemini raw response:", text)

    let jsonText = text.trim()
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    let response
    try {
      response = JSON.parse(jsonText)
      console.log("[v0] Parsed Gemini response:", response)
    } catch (parseError) {
      console.error("[v0] JSON parsing failed:", parseError)
      console.error("[v0] Raw text that failed to parse:", jsonText)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    const step3UpdateData = {
      step3_corrected: response.corrected,
      step3_notes: response.notes,
      step3_alternative1: response.alternative1,
      step3_alternative1_notes: response.alternative1_notes,
      step3_alternative2: response.alternative2,
      step3_alternative2_notes: response.alternative2_notes,
    }

    console.log("[v0] Updating database with step3 data:", step3UpdateData)

    const { error: step3Error } = await supabase
      .from("lessons")
      .update(step3UpdateData)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (step3Error) {
      console.error("Step3 database update error:", step3Error)
      return NextResponse.json({ error: "Failed to save corrections" }, { status: 500 })
    }

    console.log("[v0] Step2 API returning response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Error in step2 API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
