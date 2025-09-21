"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Star, RotateCcw } from "lucide-react"
import Link from "next/link"

interface LessonFlowProps {
  userId: string
}

type LessonStep = 1 | 2 | 3

interface LessonData {
  step1_context: string
  step1_input: string
  step2_clarification: string
  step2_user_confirmation: boolean
  step2_user_clarification: string
  step3_corrected: string
  step3_notes: string
  step3_alternative1: string
  step3_alternative1_notes: string
  step3_alternative2: string
  step3_alternative2_notes: string
  rating: number | null
}

export default function LessonFlow({ userId }: LessonFlowProps) {
  const [currentStep, setCurrentStep] = useState<LessonStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showClarificationInput, setShowClarificationInput] = useState(false)
  const [userClarification, setUserClarification] = useState("")
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [lessonData, setLessonData] = useState<LessonData>({
    step1_context: "",
    step1_input: "",
    step2_clarification: "",
    step2_user_confirmation: false,
    step2_user_clarification: "",
    step3_corrected: "",
    step3_notes: "",
    step3_alternative1: "",
    step3_alternative1_notes: "",
    step3_alternative2: "",
    step3_alternative2_notes: "",
    rating: null,
  })

  const handleStep1Submit = async () => {
    if (!lessonData.step1_context.trim() || !lessonData.step1_input.trim()) {
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Calling step1 API with:", {
        context: lessonData.step1_context,
        input: lessonData.step1_input,
        userId, // Added userId to the request
      })

      // Call AI to generate clarification
      const response = await fetch("/api/lesson/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: lessonData.step1_context,
          input: lessonData.step1_input,
          userId, // Added userId to the request
        }),
      })

      console.log("[v0] Step1 API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Step1 API error:", errorText)
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Step1 API response data:", data)

      setLessonData((prev) => ({
        ...prev,
        step2_clarification: data.clarification,
      }))
      setCurrentStep(2)
    } catch (error) {
      console.error("[v0] Error in step 1:", error)
      alert("Error processing your request. Please check the console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (confirmed: boolean, clarification?: string) => {
    setIsLoading(true)
    try {
      console.log("[v0] Calling step2 API with:", {
        userId,
        context: lessonData.step1_context,
        input: lessonData.step1_input,
        confirmed,
        clarification: clarification || "",
        originalClarification: lessonData.step2_clarification,
      })

      const response = await fetch("/api/lesson/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          context: lessonData.step1_context,
          input: lessonData.step1_input,
          confirmed,
          clarification: clarification || "",
          originalClarification: lessonData.step2_clarification,
        }),
      })

      console.log("[v0] Step2 API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Step2 API error:", errorText)
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Step2 API response data:", data)

      setLessonData((prev) => ({
        ...prev,
        step2_user_confirmation: confirmed,
        step2_user_clarification: clarification || "",
        step3_corrected: data.corrected,
        step3_notes: data.notes,
        step3_alternative1: data.alternative1,
        step3_alternative1_notes: data.alternative1_notes,
        step3_alternative2: data.alternative2,
        step3_alternative2_notes: data.alternative2_notes,
      }))

      console.log("[v0] Updated lesson data with step3 content")
      setCurrentStep(3)
      setShowClarificationInput(false)
      setUserClarification("")
    } catch (error) {
      console.error("[v0] Error in step 2:", error)
      alert("Error processing step 2. Please check the console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRating = async (rating: number) => {
    setSelectedRating(rating)
    setIsLoading(true)
    try {
      const response = await fetch("/api/lesson/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          lessonData: { ...lessonData, rating },
        }),
      })

      console.log("[v0] Step2 API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error saving lesson:", errorData)
        alert("Error saving rating. Please try again.")
        setSelectedRating(null)
      } else {
        setLessonData((prev) => ({ ...prev, rating }))
      }
    } catch (error) {
      console.error("Error saving lesson:", error)
      alert("Error saving rating. Please try again.")
      setSelectedRating(null)
    } finally {
      setIsLoading(false)
    }
  }

  const resetLesson = () => {
    setCurrentStep(1)
    setSelectedRating(null)
    setLessonData({
      step1_context: "",
      step1_input: "",
      step2_clarification: "",
      step2_user_confirmation: false,
      step2_user_clarification: "",
      step3_corrected: "",
      step3_notes: "",
      step3_alternative1: "",
      step3_alternative1_notes: "",
      step3_alternative2: "",
      step3_alternative2_notes: "",
      rating: null,
    })
    setShowClarificationInput(false)
    setUserClarification("")
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
          <h1 className="text-2xl font-bold">Mandarin Lesson</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Step {currentStep} of 3</Badge>
          <Button variant="outline" size="sm" onClick={resetLesson}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New Lesson
          </Button>
        </div>
      </div>

      {/* Step 1: User Input */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Describe Your Situation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Context (What situation are you in?)</label>
              <Textarea
                placeholder="e.g., I'm at a restaurant and want to order food..."
                value={lessonData.step1_context}
                onChange={(e) => setLessonData((prev) => ({ ...prev, step1_context: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">What do you want to say in Mandarin?</label>
              <Textarea
                placeholder="e.g., I would like to order the beef noodles..."
                value={lessonData.step1_input}
                onChange={(e) => setLessonData((prev) => ({ ...prev, step1_input: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            <Button
              onClick={handleStep1Submit}
              disabled={isLoading || !lessonData.step1_context.trim() || !lessonData.step1_input.trim()}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Intent Clarification */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Confirm Your Intent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">AI Understanding:</p>
              <p className="text-gray-700">{lessonData.step2_clarification}</p>
            </div>

            {!showClarificationInput ? (
              <div className="text-center">
                <p className="text-sm font-medium mb-4">Is this what you meant to say?</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => handleStep2Submit(true)} disabled={isLoading} className="px-8">
                    {isLoading ? "Processing..." : "Yes, that's correct"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowClarificationInput(true)}
                    disabled={isLoading}
                    className="px-8"
                  >
                    No, let me clarify
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Please clarify what you meant to say:</label>
                  <Textarea
                    placeholder="Explain what you actually meant to express..."
                    value={userClarification}
                    onChange={(e) => setUserClarification(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleStep2Submit(false, userClarification)}
                    disabled={isLoading || !userClarification.trim()}
                    className="flex-1"
                  >
                    {isLoading ? "Processing..." : "Submit Clarification"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowClarificationInput(false)
                      setUserClarification("")
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Corrections and Alternatives */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Learn and Improve</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Corrected Version */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Corrected Mandarin:</h3>
                <p className="text-lg font-medium text-green-900 mb-2">{lessonData.step3_corrected}</p>
                <p className="text-sm text-green-700">{lessonData.step3_notes}</p>
              </div>

              {/* Alternative 1 */}
              {lessonData.step3_alternative1 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Alternative 1:</h3>
                  <p className="text-lg font-medium text-blue-900 mb-2">{lessonData.step3_alternative1}</p>
                  <p className="text-sm text-blue-700">{lessonData.step3_alternative1_notes}</p>
                </div>
              )}

              {/* Alternative 2 */}
              {lessonData.step3_alternative2 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Alternative 2:</h3>
                  <p className="text-lg font-medium text-purple-900 mb-2">{lessonData.step3_alternative2}</p>
                  <p className="text-sm text-purple-700">{lessonData.step3_alternative2_notes}</p>
                </div>
              )}

              {/* Rating */}
              <div className="text-center pt-6 border-t">
                <p className="text-sm font-medium mb-4">How helpful was this lesson?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={selectedRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRating(rating)}
                      disabled={isLoading}
                      className={`transition-all duration-200 ${
                        selectedRating === rating
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                          : "hover:bg-yellow-50 hover:border-yellow-300"
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${selectedRating === rating ? "fill-current text-white" : "text-gray-400"}`}
                      />
                    </Button>
                  ))}
                </div>
                {selectedRating && <p className="text-sm text-green-600 mt-2">Thank you for your feedback!</p>}
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={resetLesson} variant="outline" className="flex-1 bg-transparent">
                  Start New Lesson
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
