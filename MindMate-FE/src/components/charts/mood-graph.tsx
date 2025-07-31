"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import type { MoodEntry } from "@/lib/data"

interface MoodGraphProps {
  moodData: MoodEntry[]
  className?: string
}

export default function MoodGraph({ moodData, className = "" }: MoodGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || moodData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height
    const padding = 40

    ctx.clearRect(0, 0, width, height)

    const sortedData = [...moodData].sort((a, b) => a.date.getTime() - b.date.getTime())
    const maxValue = 5
    const minValue = 1

    const points = sortedData.map((entry, index) => ({
      x: padding + (index * (width - 2 * padding)) / Math.max(sortedData.length - 1, 1),
      y: height - padding - ((entry.value - minValue) * (height - 2 * padding)) / (maxValue - minValue),
      value: entry.value,
      emoji: entry.emoji,
      date: entry.date,
    }))

    // Grid lines
    ctx.strokeStyle = "rgba(156, 163, 175, 0.3)"
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      const y = height - padding - ((i - minValue) * (height - 2 * padding)) / (maxValue - minValue)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Line and fill
    if (points.length > 1) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "rgba(147, 51, 234, 0.8)")
      gradient.addColorStop(1, "rgba(236, 72, 153, 0.8)")

      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.stroke()

      const fillGradient = ctx.createLinearGradient(0, 0, 0, height)
      fillGradient.addColorStop(0, "rgba(147, 51, 234, 0.1)")
      fillGradient.addColorStop(1, "rgba(236, 72, 153, 0.05)")

      ctx.fillStyle = fillGradient
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.lineTo(points[points.length - 1].x, height - padding)
      ctx.lineTo(points[0].x, height - padding)
      ctx.closePath()
      ctx.fill()
    }

    // Points
    points.forEach((point) => {
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI)
      ctx.fill()

      const pointGradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 6)
      pointGradient.addColorStop(0, "rgba(147, 51, 234, 1)")
      pointGradient.addColorStop(1, "rgba(236, 72, 153, 1)")

      ctx.fillStyle = pointGradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Labels
    ctx.fillStyle = "rgba(75, 85, 99, 0.8)"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"

    for (let i = 1; i <= 5; i++) {
      const y = height - padding - ((i - minValue) * (height - 2 * padding)) / (maxValue - minValue)
      ctx.fillText(i.toString(), 20, y + 4)
    }

    points.forEach((point, index) => {
      if (index % Math.ceil(points.length / 4) === 0) {
        const dateStr = point.date.toLocaleDateString([], { month: "short", day: "numeric" })
        ctx.fillText(dateStr, point.x, height - 10)
      }
    })
  }, [moodData])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white text-gray-800 rounded-2xl p-6 shadow-lg ${className}`}
    >
      <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
      <div className="relative">
        <canvas ref={canvasRef} className="w-full h-64 rounded-lg" />
        {moodData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">No mood data available</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
