"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send } from "lucide-react"

const journalPrompts = [
  "What made you smile today?",
  "What are you grateful for right now?",
  "How did you take care of yourself today?",
  "What's one thing you learned about yourself?",
  "What would you tell a friend who's having a tough day?",
  "What's something you're looking forward to?",
]

export default function QuickJournal() {
  const [entry, setEntry] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState(journalPrompts[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const getRandomPrompt = () => {
    const availablePrompts = journalPrompts.filter((p) => p !== currentPrompt)
    const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)]
    setCurrentPrompt(randomPrompt)
  }

  const handleSubmit = async () => {
    if (!entry.trim()) return

    setIsSubmitting(true)

    // TODO: Connect to backend API
    const journalData = {
      content: entry,
      prompt: currentPrompt,
      timestamp: new Date(),
    }

    console.log("Submitting journal entry:", journalData)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setEntry("")
    setIsSubmitting(false)

    // Reset submitted state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Quick Journal</h2>
        <Button variant="ghost" size="sm" onClick={getRandomPrompt} className="text-purple-600 hover:text-purple-700">
          <Sparkles className="h-4 w-4 mr-1" />
          New Prompt
        </Button>
      </div>

      <motion.div
        key={currentPrompt}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4"
      >
        <p className="text-purple-800 font-medium">💭 {currentPrompt}</p>
      </motion.div>

      <div className="space-y-4">
        <Textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Start writing your thoughts..."
          className="min-h-[120px] border-2 border-gray-200 focus:border-purple-400 rounded-xl resize-none"
        />

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{entry.length} characters</p>
          <Button
            onClick={handleSubmit}
            disabled={!entry.trim() || isSubmitting}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Save Entry
              </>
            )}
          </Button>
        </div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
          >
            <p className="text-green-800">Journal entry saved! 📝</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
