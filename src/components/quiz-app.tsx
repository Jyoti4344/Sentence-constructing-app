"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { StartScreen } from "./start-screen"
import { QuestionScreen } from "./question-screen"
import { ResultsScreen } from "./results-screen"
import type { Question, UserAnswer } from "../lib/types"

export function QuizApp() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<"start" | "question" | "results">("start")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3001/data")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const data = await response.json()
        console.log("Fetched data:", data)
  
        // Check if data has a 'questions' property and it's an array
        if (data && Array.isArray(data.questions)) {
          setQuestions(data.questions)
        } else {
          throw new Error("Invalid data format")
        }
      } catch (err) {
        setError("Failed to load questions. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  
    fetchQuestions()
  }, [])

  const startQuiz = () => {
    setCurrentScreen("question")
    setCurrentQuestionIndex(0)
    setUserAnswers([])
  }

  const handleNextQuestion = (userAnswer: string[]) => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex].questionId,
      userAnswer,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect: JSON.stringify(userAnswer) === JSON.stringify(questions[currentQuestionIndex].correctAnswer),
    }

    setUserAnswers(newUserAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setCurrentScreen("results")
    }
  }

  const handleTimeUp = () => {
    // If time is up, move to next question with empty answer
    handleNextQuestion([])
  }

  const restartQuiz = () => {
    setCurrentScreen("start")
  }

  if (loading) {
    return (
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-red-500">Error</h2>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {currentScreen === "start" && <StartScreen onStart={startQuiz} />}

      {currentScreen === "question" && questions.length > 0 && (
        <QuestionScreen
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onNext={handleNextQuestion}
          onTimeUp={handleTimeUp}
          onRestart={restartQuiz}
        />
      )}

      {currentScreen === "results" && (
        <ResultsScreen userAnswers={userAnswers} questions={questions} onRestart={restartQuiz} />
      )}
    </>
  )
}
