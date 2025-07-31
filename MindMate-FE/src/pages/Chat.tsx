import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import ChatMessage from "@/components/chat/chat-message"
import ChatInput from "@/components/chat/chat-input"

// Mock chat messages - to be replaced with backend integration
const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm MindMate, your wellbeing companion. I'm here to listen and support you. How are you feeling today?",
    sender: "bot", // TS now knows this is type "bot"
    timestamp: new Date(Date.now() - 60000),
  },
]


interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // TODO: Connect to AI backend
    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(content),
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Mock bot response generator - replace with actual AI integration
  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "I hear you. It's completely normal to feel that way. Can you tell me more about what's on your mind?",
      "Thank you for sharing that with me. Your feelings are valid. What would help you feel better right now?",
      "That sounds challenging. Remember, you're not alone in this. What's one small thing that usually brings you comfort?",
      "I appreciate you opening up. It takes courage to share your feelings. How can I best support you today?",
      "Your wellbeing matters. What you're experiencing is important. Would you like to explore some coping strategies together?",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-sm border-b border-white/20 p-4"
      >
        <div className="container mx-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">MindMate</h1>
              <p className="text-sm text-gray-600">Your AI Wellbeing Companion</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} isLast={index === messages.length - 1} />
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 flex-shrink-0">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 max-w-xs">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}
