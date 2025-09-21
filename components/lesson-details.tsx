"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Star } from "lucide-react"
import Link from "next/link"

interface LessonDetailsProps {
  lesson: any
}

export default function LessonDetails({ lesson }: LessonDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Lesson Details</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(lesson.created_at)}
              </div>
              {lesson.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{lesson.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Badge variant="outline">{lesson.step3_corrected ? "Completed" : "In Progress"}</Badge>
      </div>

      <div className="space-y-6">
        {/* Step 1: Original Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 1: Your Original Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Context:</h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{lesson.step1_context}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">What you wanted to say:</h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{lesson.step1_input}</p>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Intent Clarification */}
        {lesson.step2_clarification && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step 2: Intent Clarification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">AI Understanding:</h4>
                <p className="text-gray-900 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  {lesson.step2_clarification}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={lesson.step2_user_confirmation ? "default" : "secondary"}>
                  {lesson.step2_user_confirmation ? "Confirmed" : "Clarified"}
                </Badge>
                {!lesson.step2_user_confirmation && lesson.step2_user_clarification && (
                  <span className="text-sm text-gray-600">User clarification: "{lesson.step2_user_clarification}"</span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Corrections and Alternatives */}
        {lesson.step3_corrected && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step 3: Learning Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Corrected Version */}
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2">Corrected Mandarin:</h4>
                <p className="text-lg font-medium text-green-900 mb-2">{lesson.step3_corrected}</p>
                <p className="text-sm text-green-700">{lesson.step3_notes}</p>
              </div>

              {/* Alternative 1 */}
              {lesson.step3_alternative1 && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Alternative 1 (Formal):</h4>
                  <p className="text-lg font-medium text-blue-900 mb-2">{lesson.step3_alternative1}</p>
                  <p className="text-sm text-blue-700">{lesson.step3_alternative1_notes}</p>
                </div>
              )}

              {/* Alternative 2 */}
              {lesson.step3_alternative2 && (
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">Alternative 2 (Casual):</h4>
                  <p className="text-lg font-medium text-purple-900 mb-2">{lesson.step3_alternative2}</p>
                  <p className="text-sm text-purple-700">{lesson.step3_alternative2_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button asChild className="flex-1">
            <Link href="/lesson">Start New Lesson</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
