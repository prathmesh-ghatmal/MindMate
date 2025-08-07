import { motion } from "framer-motion"
import { Calendar, Pencil, Tag } from "lucide-react"

interface JournalEntryProps {
  entry: {
    id: string
    title: string
    content: string
    mood: { emoji: string; value: number }
    date: Date
    tags: string[]
  }
  index: number
  onEdit?: (entry: any) => void
}


export default function JournalEntry({ entry, index, onEdit }: JournalEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4 relative">
       <button
  className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-primary"
  onClick={() => onEdit?.(entry)}
>
  <Pencil className="w-4 h-4" />
</button>



        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{entry.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(entry.date).toLocaleDateString()}</span>

            </div>
            <div className="flex items-center space-x-1">
              <span className="text-lg">{entry.mood.emoji}</span>
              <span>Mood: {entry.mood.value}/5</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{entry.content}</p>

      {entry.tags.length > 0 && (
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag, idx) => (
  <span key={`${tag}-${idx}`} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
    {tag}
  </span>
))}

          </div>
        </div>
      )}
    </motion.div>
  )
}
