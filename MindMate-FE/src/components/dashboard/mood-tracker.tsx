"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { createMoodLog } from "@/services/moodService"

const moodEmojis = ["😢", "😕", "😐", "😊", "😄"]
const moodLabels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"]

interface MoodTrackerProps {
  currentMood: { emoji: string; value: number } | null
  onMoodChange: (mood: { emoji: string; value: number }) => void
  lastMood?: { emoji: string; value: number; date: Date } | null
}

export default function MoodTracker({ currentMood, onMoodChange, lastMood }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number>(3)
  const [isSubmitting, setIsSubmitting] = useState(false)

const handleMoodSubmit = async () => {
  setIsSubmitting(true)

  try {
    const response = await createMoodLog(selectedMood)
    console.log(response.data)
    const newMood = {
      emoji: moodEmojis[selectedMood - 1],
      value: selectedMood,
    }

    onMoodChange(newMood)
  } catch (error) {
    console.error("Failed to log mood:", error) 
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">How are you feeling?</h2>
        {lastMood && (
          <div className="text-right">
            <div className="text-sm text-gray-600">Last logged</div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{lastMood.emoji}</span>
              <span className="text-sm text-gray-500">{lastMood.date.toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Mood Emoji Display */}
        <div className="text-center">
          <motion.div
            key={selectedMood}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-8xl mb-2"
          >
            {moodEmojis[selectedMood - 1]}
          </motion.div>
          <p className="text-lg font-medium text-gray-700">{moodLabels[selectedMood - 1]}</p>
        </div>

        {/* Mood Slider */}
        <div className="space-y-4">
          <Slider
            value={[selectedMood]}
            onValueChange={(value) => setSelectedMood(value[0])}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleMoodSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl py-3"
        >
          {isSubmitting ? "Saving..." : "Log My Mood"}
        </Button>

        {currentMood && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
          >
            <p className="text-green-800">Mood logged successfully! 🎉</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
