"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Star, TrendingUp, Calendar, LogOut, User } from "lucide-react"
import { useState } from "react"

interface DashboardContentProps {
  user: any
  profile: any
  lessons: any[]
}

export default function DashboardContent({ user, profile, lessons }: DashboardContentProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getAverageRating = () => {
    const ratedLessons = lessons.filter((lesson) => lesson.rating)
    if (ratedLessons.length === 0) return 0
    return (ratedLessons.reduce((sum, lesson) => sum + lesson.rating, 0) / ratedLessons.length).toFixed(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.display_name || user.email?.split("@")[0]}!
          </h1>
          <p className="text-gray-600 mt-1">Continue your Mandarin learning journey</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <User className="h-3 w-3 mr-1" />
            {profile?.learning_level || "Beginner"}
          </Badge>
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
            <p className="text-xs text-muted-foreground">
              {lessons.filter((l) => l.rating).length} completed with ratings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageRating()}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length > 0 ? Math.min(lessons.length, 7) : 0}</div>
            <p className="text-xs text-muted-foreground">Days this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button asChild size="lg" className="flex-1">
          <Link href="/lesson">
            <BookOpen className="h-5 w-5 mr-2" />
            Start New Lesson
          </Link>
        </Button>
      </div>

      {/* Recent Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Lessons</CardTitle>
          <CardDescription>Your latest learning sessions and progress</CardDescription>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
              <p className="text-gray-600 mb-4">Start your first lesson to begin learning Mandarin!</p>
              <Button asChild>
                <Link href="/lesson">Start Your First Lesson</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900 truncate max-w-md">
                        {lesson.step1_context.substring(0, 60)}
                        {lesson.step1_context.length > 60 ? "..." : ""}
                      </h4>
                      {lesson.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{lesson.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(lesson.created_at)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {lesson.step3_corrected ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/lesson/${lesson.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}

              {lessons.length >= 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/lessons">View All Lessons</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
