import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import LessonFlow from "@/components/lesson-flow"

export default async function LessonPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <LessonFlow userId={data.user.id} />
      </div>
    </div>
  )
}
