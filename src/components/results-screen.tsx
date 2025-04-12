"use client"

import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import type { Question, UserAnswer } from "../lib/types"
import { CheckCircle, XCircle } from "lucide-react"

interface ResultsScreenProps {
  userAnswers: UserAnswer[]
  questions: Question[]
  onRestart: () => void
}

export function ResultsScreen({ userAnswers, questions, onRestart }: ResultsScreenProps) {
  // Calculate score
  const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length
  const score = Math.round((correctAnswers / questions.length) * 100)

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-center border-b">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 border-4 border-green-500 rounded-full">
          <span className="text-3xl font-bold text-green-500">{score}</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold">Your Results</h2>
        <p className="text-muted-foreground">
          {score >= 70
            ? "Well done! You correctly formed several sentences. There are a couple of areas where improvement is needed. Pay close attention to sentence structure and word placement to ensure clarity and correctness."
            : "You need more practice. Pay close attention to sentence structure and word placement to ensure clarity and correctness."}
        </p>
      </CardHeader>
      <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
        <div className="space-y-8">
          {userAnswers.map((answer, index) => {
            const question = questions[index]
            const questionParts = question.question.split(/(____________)/g)

            return (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Prompt:</span>
                  <span className="text-sm text-muted-foreground">
                    {index + 1}/{questions.length}
                  </span>
                </div>

                <p className="mb-4 text-sm">
                  {questionParts.map((part, partIndex) => {
                    if (part === "____________") {
                      const blankIndex = Math.floor(partIndex / 2)
                      const userWord = answer.userAnswer[blankIndex] || ""
                      const correctWord = answer.correctAnswer[blankIndex]
                      const isCorrect = userWord === correctWord

                      return (
                        <span
                          key={partIndex}
                          className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}
                        >
                          {userWord || "[blank]"}
                        </span>
                      )
                    }
                    return <span key={partIndex}>{part}</span>
                  })}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Your response:</span>
                  {answer.isCorrect ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" /> Incorrect
                    </span>
                  )}
                </div>

                {!answer.isCorrect && (
                  <div className="p-3 mt-2 rounded-lg bg-gray-50">
                    <p className="mb-1 text-sm font-medium">Correct answer:</p>
                    <p className="text-sm">
                      {questionParts.map((part, partIndex) => {
                        if (part === "____________") {
                          const blankIndex = Math.floor(partIndex / 2)
                          return (
                            <span key={partIndex} className="font-medium text-green-600">
                              {answer.correctAnswer[blankIndex]}
                            </span>
                          )
                        }
                        return <span key={partIndex}>{part}</span>
                      })}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-4 border-t">
        <Button onClick={onRestart} className="bg-purple-500">Try Again</Button>
      </CardFooter>
    </Card>
  )
}
