import { motion } from "framer-motion"
import { Heart, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  isLast: boolean
}

export default function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isBot = message.sender === "bot"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-3 ${isBot ? "" : "flex-row-reverse space-x-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`rounded-full p-2 flex-shrink-0 ${
          isBot ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-teal-500 to-cyan-500"
        }`}
      >
        {isBot ? <Heart className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
      </div>

      {/* Message */}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isBot ? "" : "text-right"}`}>
        <div
          className={`rounded-2xl p-4 shadow-sm ${
            isBot
              ? "bg-white/70 backdrop-blur-sm rounded-tl-sm"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-tr-sm"
          }`}
        >
          <p className={`text-sm md:text-base ${isBot ? "text-gray-800" : "text-white"}`}>{message.content}</p>
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isBot ? "text-left" : "text-right"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  )
}
