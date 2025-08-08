"use client"

import { motion } from "framer-motion"
import { ImageIcon, Check } from "lucide-react"
import { getAllWallpapers } from "@/lib/theme-config"
import { useState } from "react"

export default function WallpaperSelector() {
  const wallpapers = getAllWallpapers()

  // Replace with a simple state if not using theme-provider
  const [currentWallpaperId, setCurrentWallpaperId] = useState(wallpapers[0]?.id || "")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSelect = (id: string) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentWallpaperId(id)
    setTimeout(() => setIsTransitioning(false), 300) // mimic transition delay
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <ImageIcon className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Wallpaper</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {wallpapers.map((wallpaper) => (
          <motion.button
            key={wallpaper.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(wallpaper.id)}
            disabled={isTransitioning}
            className={`relative aspect-video rounded-xl border-2 transition-all overflow-hidden ${
              currentWallpaperId === wallpaper.id
                ? "border-purple-400 ring-2 ring-purple-200"
                : "border-gray-200 hover:border-gray-300"
            } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className={`w-full h-full ${wallpaper.preview} flex items-center justify-center`}>
              <span className="text-xs font-medium text-gray-700">{wallpaper.displayName}</span>
            </div>
            {currentWallpaperId === wallpaper.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 bg-purple-600 text-white rounded-full p-1"
              >
                <Check className="h-3 w-3" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
