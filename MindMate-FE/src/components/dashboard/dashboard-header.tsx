"use client"

import { motion } from "framer-motion"
import { Heart} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/useAuth"


interface DashboardHeaderProps {
  user: {
    name: string
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { logout } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MindMate
              </span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-gray-800">
                {getGreeting()}, {user.name}! 👋
              </h1>
              <p className="text-sm text-gray-600">How are you feeling today?</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
           
           
            <Button variant="outline" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
