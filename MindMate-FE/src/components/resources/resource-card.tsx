import { motion } from "framer-motion"
import { ExternalLink, Play, FileText, Video, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Resource {
  id: string
  title: string
  description: string
  type: string
  duration: string
  url: string
}

interface ResourceCardProps {
  resource: Resource
  gradient: string
  index: number
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "video":
      return Video
    case "audio":
      return Headphones
    case "article":
    case "guide":
      return FileText
    default:
      return Play
  }
}

export default function ResourceCard({ resource, gradient, index }: ResourceCardProps) {
  const TypeIcon = getTypeIcon(resource.type)

  const handleResourceClick = () => {
    // TODO: Connect to actual resource URLs
    console.log("Opening resource:", resource.url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`bg-gradient-to-r ${gradient} rounded-lg p-2 group-hover:scale-110 transition-transform`}>
          <TypeIcon className="h-5 w-5 text-white" />
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{resource.type}</span>
        </div>
      </div>

      <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
        {resource.title}
      </h4>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{resource.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">{resource.duration}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResourceClick}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Open
        </Button>
      </div>
    </motion.div>
  )
}
