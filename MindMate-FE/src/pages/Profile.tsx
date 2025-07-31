import { motion } from "framer-motion"
import { ArrowLeft, User, Calendar, Award, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthProvider"
import { mockUser, mockMoodHistory } from "@/lib/data"
import MoodGraph from "@/components/charts/mood-graph"
import WallpaperSelector from "@/components/profile/wallpaper-selector"
import { useState } from "react"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState(mockUser)

  const handleSaveProfile = () => {
    // TODO: Connect to backend API
    console.log("Saving profile:", userProfile)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 rounded-full p-2">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="bg-purple-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{userProfile.name}</h2>
                <p className="text-gray-600">{userProfile.email}</p>
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">Name</label>
                      <Input
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
                      <Input
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-purple-500 hover:opacity-90 text-white rounded-xl">
                        Save
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="flex-1 rounded-xl bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {userProfile.joinDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>{userProfile.streak} day streak</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="w-full rounded-xl bg-transparent"
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Wallpaper Selector */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <WallpaperSelector />
            </motion.div>
          </div>

          {/* Right Column - Charts and Stats */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <MoodGraph moodData={mockMoodHistory} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-3 gap-4"
            >
              <div className="bg-purple-500 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Total Entries</h3>
                <p className="text-3xl font-bold">{mockMoodHistory.length}</p>
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Average Mood</h3>
                <p className="text-3xl font-bold">
                  {(mockMoodHistory.reduce((sum, entry) => sum + entry.value, 0) / mockMoodHistory.length).toFixed(1)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
                <p className="text-3xl font-bold">{userProfile.streak}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
