import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, Save, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

const moodEmojis = ["😢", "😕", "😐", "😊", "😄"]
const suggestions = [
  "What made you smile today?",
  "What are you grateful for?",
  "How did you grow today?",
  "What challenged you?",
  "What brought you peace?",
  "What are you looking forward to?",
]

interface NewEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entry: any) => void
}

export default function NewEntryModal({ isOpen, onClose, onSave }: NewEntryModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState(3)
  const [tags, setTags] = useState("")
  const [currentSuggestion, setCurrentSuggestion] = useState(suggestions[0])

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return

    const entry = {
      title: title.trim(),
      content: content.trim(),
      mood: {
        emoji: moodEmojis[mood - 1],
        value: mood,
      },
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    onSave(entry)

    // Reset form
    setTitle("")
    setContent("")
    setMood(3)
    setTags("")
    onClose()
  }

  const getNewSuggestion = () => {
    const availableSuggestions = suggestions.filter((s) => s !== currentSuggestion)
    const randomSuggestion = availableSuggestions[Math.floor(Math.random() * availableSuggestions.length)]
    setCurrentSuggestion(randomSuggestion)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                New Journal Entry
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Suggestion */}
              <motion.div
                key={currentSuggestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4"
              >
                <div className="flex justify-between items-start">
                  <p className="text-purple-800 font-medium flex-1">💭 {currentSuggestion}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={getNewSuggestion}
                    className="text-purple-600 hover:text-purple-700 ml-2"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your thoughts</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your thoughts..."
                  className="min-h-[200px] rounded-xl border-2 border-gray-200 focus:border-purple-400 resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">{content.length} characters</p>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
                <div className="text-center mb-4">
                  <motion.div key={mood} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-6xl mb-2">
                    {moodEmojis[mood - 1]}
                  </motion.div>
                </div>
                <Slider
                  value={[mood]}
                  onValueChange={(value) => setMood(value[0])}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="gratitude, work, family (separate with commas)"
                  className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!title.trim() || !content.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
