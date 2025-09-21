import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Users, Trophy } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Master Mandarin with AI</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Advanced Mandarin learning for serious students. Practice real conversations, get instant feedback, and
            improve your fluency with personalized AI coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/auth/signup">Start Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Interactive Lessons</CardTitle>
              <CardDescription>Practice with real-world scenarios and get instant AI feedback</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Personalized Learning</CardTitle>
              <CardDescription>AI adapts to your level and learning style for optimal progress</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>Monitor your improvement with detailed analytics and insights</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Begin?</CardTitle>
              <CardDescription>Join thousands of learners improving their Mandarin skills</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup">Create Your Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
