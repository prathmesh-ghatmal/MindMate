// Static theme configuration for Tailwind to include at build time
export interface ThemeOption {
  id: string
  name: string
  displayName: string
  background: string
  cardBackground: string
  textPrimary: string
  textSecondary: string
  accent: string
  preview: string
}

export interface WallpaperOption {
  id: string
  name: string
  displayName: string
  backgroundImage: string
  overlay: string
  preview: string
}

// Static theme configurations - Tailwind will include these classes
export const themeConfig: Record<string, ThemeOption> = {
  light: {
    id: "light",
    name: "light",
    displayName: "Light",
    background: "bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50",
    cardBackground: "bg-white/70 backdrop-blur-sm",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
    accent: "bg-gradient-to-r from-purple-600 to-pink-600",
    preview: "bg-gradient-to-br from-purple-50 to-pink-50",
  },
  dark: {
    id: "dark",
    name: "dark",
    displayName: "Dark",
    background: "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800",
    cardBackground: "bg-gray-800/70 backdrop-blur-sm",
    textPrimary: "text-gray-100",
    textSecondary: "text-gray-300",
    accent: "bg-gradient-to-r from-purple-500 to-pink-500",
    preview: "bg-gradient-to-br from-gray-800 to-purple-900",
  },
  lavender: {
    id: "lavender",
    name: "lavender",
    displayName: "Lavender Dreams",
    background: "bg-gradient-to-br from-purple-200 via-lavender-100 to-purple-300",
    cardBackground: "bg-white/60 backdrop-blur-sm",
    textPrimary: "text-purple-900",
    textSecondary: "text-purple-700",
    accent: "bg-gradient-to-r from-purple-600 to-purple-800",
    preview: "bg-gradient-to-br from-purple-200 to-purple-300",
  },
  ocean: {
    id: "ocean",
    name: "ocean",
    displayName: "Ocean Breeze",
    background: "bg-gradient-to-br from-teal-200 via-cyan-100 to-blue-300",
    cardBackground: "bg-white/60 backdrop-blur-sm",
    textPrimary: "text-teal-900",
    textSecondary: "text-teal-700",
    accent: "bg-gradient-to-r from-teal-600 to-cyan-600",
    preview: "bg-gradient-to-br from-teal-200 to-blue-300",
  },
  sunset: {
    id: "sunset",
    name: "sunset",
    displayName: "Sunset Glow",
    background: "bg-gradient-to-br from-orange-200 via-pink-200 to-red-300",
    cardBackground: "bg-white/60 backdrop-blur-sm",
    textPrimary: "text-orange-900",
    textSecondary: "text-orange-700",
    accent: "bg-gradient-to-r from-orange-600 to-pink-600",
    preview: "bg-gradient-to-br from-orange-200 to-pink-300",
  },
  forest: {
    id: "forest",
    name: "forest",
    displayName: "Forest Calm",
    background: "bg-gradient-to-br from-green-200 via-emerald-100 to-teal-300",
    cardBackground: "bg-white/60 backdrop-blur-sm",
    textPrimary: "text-green-900",
    textSecondary: "text-green-700",
    accent: "bg-gradient-to-r from-green-600 to-teal-600",
    preview: "bg-gradient-to-br from-green-200 to-teal-300",
  },
}

// Static wallpaper configurations
export const wallpaperConfig: Record<string, WallpaperOption> = {
  none: {
    id: "none",
    name: "none",
    displayName: "None",
    backgroundImage: "",
    overlay: "",
    preview: "bg-transparent",
  },
  hearts: {
    id: "hearts",
    name: "hearts",
    displayName: "Floating Hearts",
    backgroundImage: "bg-hearts-pattern",
    overlay: "bg-white/10",
    preview: "bg-pink-50 bg-hearts-pattern",
  },
  waves: {
    id: "waves",
    name: "waves",
    displayName: "Gentle Waves",
    backgroundImage: "bg-waves-pattern",
    overlay: "bg-white/10",
    preview: "bg-blue-50 bg-waves-pattern",
  },
  dots: {
    id: "dots",
    name: "dots",
    displayName: "Soft Dots",
    backgroundImage: "bg-dots-pattern",
    overlay: "bg-white/10",
    preview: "bg-purple-50 bg-dots-pattern",
  },
  mesh: {
    id: "mesh",
    name: "mesh",
    displayName: "Gradient Mesh",
    backgroundImage: "bg-mesh-pattern",
    overlay: "bg-white/5",
    preview: "bg-gradient-to-br from-purple-100 to-pink-100",
  },
}

// Get theme by ID with fallback
export const getTheme = (themeId: string): ThemeOption => {
  return themeConfig[themeId] || themeConfig.light
}

// Get wallpaper by ID with fallback
export const getWallpaper = (wallpaperId: string): WallpaperOption => {
  return wallpaperConfig[wallpaperId] || wallpaperConfig.none
}

// Get all available themes
export const getAllThemes = (): ThemeOption[] => {
  return Object.values(themeConfig)
}

// Get all available wallpapers
export const getAllWallpapers = (): WallpaperOption[] => {
  return Object.values(wallpaperConfig)
}
