import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, lessonData } = await request.json()

    if (!userId || !lessonData) {
      return NextResponse.json({ error: "User ID and lesson data are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single()

    if (userCheckError || !existingUser) {
      const { error: userInsertError } = await supabase.from("users").insert({
        id: user.id,
        created_at: new Date().toISOString(),
      })

      if (userInsertError) {
        console.error("Error creating user:", userInsertError)
        return NextResponse.json({ error: "Failed to create user record" }, { status: 500 })
      }
    }

    // Insert lesson data
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        user_id: user.id,
        step1_context: lessonData.step1_context,
        step1_input: lessonData.step1_input,
        step2_clarification: lessonData.step2_clarification,
        step2_user_confirmation: lessonData.step2_user_confirmation,
        step2_user_clarification: lessonData.step2_user_clarification,
        step3_corrected: lessonData.step3_corrected,
        step3_notes: lessonData.step3_notes,
        step3_alternative1: lessonData.step3_alternative1,
        step3_alternative1_notes: lessonData.step3_alternative1_notes,
        step3_alternative2: lessonData.step3_alternative2,
        step3_alternative2_notes: lessonData.step3_alternative2_notes,
        rating: lessonData.rating,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save lesson" }, { status: 500 })
    }

    return NextResponse.json({ success: true, lesson: data })
  } catch (error) {
    console.error("Error in save API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
