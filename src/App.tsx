import { QuizApp } from "./components/quiz-app"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <QuizApp />
      </div>
    </ThemeProvider>
  )
}

export default App
