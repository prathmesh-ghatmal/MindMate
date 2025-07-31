import { motion } from "framer-motion"
import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MoodTracker from "@/components/dashboard/mood-tracker"
import QuickJournal from "@/components/dashboard/quick-journal"
import { Button } from "@/components/ui/button"
import { MessageCircle, BookOpen, Lightbulb, User } from "lucide-react"
import { useNavigate } from "react-router-dom"


// Mock data - to be replaced with backend integration
const mockUser = {
  name: "Alex",
  lastMood: { emoji: "😊", value: 4, date: new Date() },
  streak: 7,
}

export default function Dashboard() {
  const [currentMood, setCurrentMood] = useState<{ emoji: string; value: number } | null>(null)
  const navigate = useNavigate()

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Chat with MindMate",
      description: "Talk to your AI companion",
      action: () => navigate("/chat"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Journal",
      description: "Write your thoughts",
      action: () => navigate("/journal"),
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      icon: Lightbulb,
      title: "Resources",
      description: "Explore wellness content",
      action: () => navigate("/resources"),
      gradient: "from-orange-500 to-pink-500",
    },
    {
      icon: User,
      title: "Profile",
      description: "View your progress",
      action: () => navigate("/profile"),
      gradient: "from-indigo-500 to-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <DashboardHeader user={mockUser} />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Mood & Journal */}
          <div className="lg:col-span-2 space-y-6">
            <MoodTracker currentMood={currentMood} onMoodChange={setCurrentMood} lastMood={mockUser.lastMood} />
            <QuickJournal />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-4 h-auto hover:bg-white/50 group"
                      onClick={action.action}
                    >
                      <div
                        className={`bg-gradient-to-r ${action.gradient} rounded-lg p-2 mr-3 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800">{action.title}</div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Streak Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-2">Daily Streak 🔥</h3>
              <div className="text-3xl font-bold mb-1">{mockUser.streak} days</div>
              <p className="text-purple-100 text-sm">Keep up the great work!</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
