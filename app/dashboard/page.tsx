import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardContent from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user profile and recent lessons
  const [profileResult, lessonsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", data.user.id).single(),
    supabase
      .from("lessons")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const profile = profileResult.data
  const lessons = lessonsResult.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardContent user={data.user} profile={profile} lessons={lessons} />
    </div>
  )
}
