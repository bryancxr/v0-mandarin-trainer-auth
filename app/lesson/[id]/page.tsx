import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import LessonDetails from "@/components/lesson-details"

interface LessonDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch the specific lesson
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (lessonError || !lesson) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <LessonDetails lesson={lesson} />
      </div>
    </div>
  )
}
