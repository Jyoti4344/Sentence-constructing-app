"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import type { Question } from "../lib/types"
import { ArrowRight } from "lucide-react"

interface QuestionScreenProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onNext: (userAnswer: string[]) => void
  onTimeUp: () => void
  onRestart: () => void
}

export function QuestionScreen({ question, questionNumber, totalQuestions, onNext, onTimeUp, onRestart }: QuestionScreenProps) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [availableOptions, setAvailableOptions] = useState<string[]>([])
  const timerRef = useRef<number | null>(null)

  // Count the number of blanks in the question
  const blankCount = (question.question.match(/____________/g) || []).length

  // Initialize available options
  useEffect(() => {
    setSelectedWords([])
    setAvailableOptions([...question.options])
    setTimeLeft(30)

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Start the timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [question, onTimeUp])

  const handleWordSelect = (word: string) => {
    if (selectedWords.length < blankCount) {
      setSelectedWords([...selectedWords, word])
      setAvailableOptions(availableOptions.filter((w) => w !== word))
    }
  }

  const handleBlankClick = (index: number) => {
    if (index < selectedWords.length) {
      const wordToReturn = selectedWords[index]
      const newSelectedWords = [...selectedWords]
      newSelectedWords.splice(index, 1)
      setSelectedWords(newSelectedWords)
      setAvailableOptions([...availableOptions, wordToReturn])
    }
  }

  const handleNext = () => {
    onNext(selectedWords)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = (timeLeft / 30) * 100

  // Split the question into parts (text and blanks)
  const questionParts = question.question.split(/(____________)/g)

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="text-xl font-semibold">{formatTime(timeLeft)}</div>
        <Button variant="outline" size="sm" onClick={onRestart}>
          Quit
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress bar */}
        <div className="w-full h-2 mb-8 bg-gray-200 rounded-full">
          <div
            className="h-full transition-all duration-1000 ease-linear rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <h2 className="mb-8 text-lg text-center">Select the missing words in the correct order</h2>

        <div className="mt-3 mb-8">
          <p className="text-lg leading-relaxed">
            {questionParts.map((part, index) => {
              if (part === "____________") {
                const blankIndex = Math.floor(index / 2)
                return (
                  <span
                    key={index}
                    onClick={() => handleBlankClick(blankIndex)}
                    className={`inline-block min-w-32 mx-1 text-center border-b-2 border-gray-400 pb-1 ${
                      selectedWords[blankIndex] ? "cursor-pointer" : ""
                    }`}
                  >
                    {selectedWords[blankIndex] ? (
                      <span className="px-3 py-1 text-base text-white bg-purple-500 rounded-full">
                        {selectedWords[blankIndex]}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                )
              }
              return <span key={index}>{part}</span>
            })}
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            {questionNumber} / {totalQuestions}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {availableOptions.map((option, index) => (
            <Button key={index} variant="outline" onClick={() => handleWordSelect(option)} className="bg-purple-500 rounded-full hover:bg-purple-300 focus:outline-none">
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 border-t">
        <Button
          onClick={handleNext}
          disabled={selectedWords.length < blankCount}
          className="w-12 h-12 p-0 text-white bg-purple-500 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
