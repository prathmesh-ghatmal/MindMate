"use client"

import { motion } from "framer-motion"
import { Palette, Check } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { getAllThemes } from "@/lib/theme-config"

export default function ThemeSelector() {
  const { currentTheme, setTheme, isTransitioning } = useTheme()
  const themes = getAllThemes()

  return (
    <div className={`${currentTheme.cardBackground} rounded-2xl p-6 shadow-lg`}>
      <div className="flex items-center space-x-2 mb-4">
        <Palette className="h-5 w-5 text-purple-600" />
        <h3 className={`text-lg font-semibold ${currentTheme.textPrimary}`}>Theme</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <motion.button
            key={theme.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme(theme.id)}
            disabled={isTransitioning}
            className={`relative flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${
              currentTheme.id === theme.id ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-gray-300"
            } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full ${theme.preview} border border-gray-200 flex-shrink-0`} />
            <span className={`text-sm font-medium ${currentTheme.textPrimary} flex-1 text-left`}>
              {theme.displayName}
            </span>
            {currentTheme.id === theme.id && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-purple-600">
                <Check className="h-4 w-4" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
