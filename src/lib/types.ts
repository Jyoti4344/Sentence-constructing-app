export interface Question {
  questionId: string
  question: string
  questionType: string
  answerType: string
  options: string[]
  correctAnswer: string[]
}

export interface UserAnswer {
  questionId: string
  userAnswer: string[]
  correctAnswer: string[]
  isCorrect: boolean
}
