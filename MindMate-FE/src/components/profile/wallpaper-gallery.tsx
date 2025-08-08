"use client"

import { motion } from "framer-motion"
import { ImageIcon, Check } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

export default function WallpaperGallery() {
  const { wallpaper, setWallpaper, themeConfig } = useTheme()

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <ImageIcon className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Wallpaper</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {themeConfig.wallpapers.map((wallpaperOption) => (
          <motion.button
            key={wallpaperOption.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setWallpaper(wallpaperOption.id)}
            className={`relative aspect-video rounded-xl border-2 transition-all overflow-hidden ${
              wallpaper === wallpaperOption.id
                ? "border-purple-400 ring-2 ring-purple-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-full h-full ${wallpaperOption.preview} flex items-center justify-center`}>
              <span className="text-xs font-medium text-gray-600">{wallpaperOption.name}</span>
            </div>
            {wallpaper === wallpaperOption.id && (
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
