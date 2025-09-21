import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Users, Trophy, Play, LogIn, UserPlus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Master Mandarin with AI</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advanced Mandarin learning for serious students. Practice real conversations, get instant feedback, and
            improve your fluency with personalized AI coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/signup">
                <UserPlus className="h-5 w-5 mr-2" />
                Start Learning
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-border hover:bg-accent">
              <Link href="/auth/login">
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Interactive Lessons</CardTitle>
              <CardDescription>Practice with real-world scenarios and get instant AI feedback</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Personalized Learning</CardTitle>
              <CardDescription>AI adapts to your level and learning style for optimal progress</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
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
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/signup">
                  <Play className="h-5 w-5 mr-2" />
                  Create Your Account
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
