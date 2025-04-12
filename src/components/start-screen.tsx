"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Sentence Construction</CardTitle>
        <p className="mt-2 text-muted-foreground">
          Select the correct words to complete the sentence by arranging the provided options in the right order.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-4 text-center border rounded-lg">
            <h3 className="mb-2 text-sm font-medium">Time Per Question</h3>
            <p className="text-xl">30 sec</p>
          </div>
          <div className="p-4 text-center border rounded-lg">
            <h3 className="mb-2 text-sm font-medium">Total Questions</h3>
            <p className="text-xl">10</p>
          </div>
          <div className="p-4 text-center border rounded-lg">
            <h3 className="mb-2 text-sm font-medium">Coins</h3>
            <p className="text-xl">
              <span className="text-yellow-500">●</span> 0
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="outline" className="bg-purple-500 hover:bg-purple-400">Back</Button>
        <Button onClick={onStart} className="bg-purple-500 hover:bg-purple-400" variant="outline">Start</Button>
      </CardFooter>
    </Card>
  )
}
