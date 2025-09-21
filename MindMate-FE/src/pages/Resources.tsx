import { motion } from "framer-motion"
import { ArrowLeft, Heart, Brain, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import ResourceCard from "@/components/resources/resource-card"

// Mock resources data - to be replaced with backend integration
const resourceCategories = [
  {
    id: "mindfulness",
    title: "Mindfulness & Meditation",
    icon: Brain,
    gradient: "from-purple-500 to-indigo-500",
    resources: [
      {
        id: "1",
        title: "5-Minute Morning Meditation",
        description: "Start your day with peace and clarity through this gentle guided meditation.",
        type: "Audio",
        duration: "5 min",
        url: "https://youtu.be/DaHH--jJBtg?si=K8tlNyydZR3hzmgB",
      },
      {
        id: "2",
        title: "Breathing Exercises for Anxiety",
        description: "Simple breathing techniques to help manage anxiety and stress.",
        type: "Guide",
        duration: "10 min",
        url: "https://www.verywellhealth.com/breathing-exercises-for-anxiety-5088091",
      },
      {
        id: "3",
        title: "Body Scan Relaxation",
        description: "Progressive muscle relaxation to release tension and promote calm.",
        type: "Audio",
        duration: "15 min",
        url: "https://youtu.be/DaHH--jJBtg?si=K8tlNyydZR3hzmgB",
      },
    ],
  },
  {
    id: "coping",
    title: "Coping Strategies",
    icon: Shield,
    gradient: "from-teal-500 to-cyan-500",
    resources: [
      {
        id: "4",
        title: "Dealing with Difficult Emotions",
        description: "Healthy ways to process and manage challenging feelings.",
        type: "Article",
        duration: "8 min read",
        url: "https://hopefulpanda.com/healthy-coping-skills/",
      },
      {
        id: "5",
        title: "Stress Management Toolkit",
        description: "Practical tools and techniques for managing daily stress.",
        type: "Guide",
        duration: "12 min",
        url: "https://www.cigna.com/knowledge-center/stress-management-toolkit",
      },
      {
        id: "6",
        title: "Building Resilience",
        description: "Strengthen your ability to bounce back from challenges.",
        type: "Video",
        duration: "20 min",
        url: "https://www.youtube.com/watch?v=It73rli7TdE",
      },
    ],
  },
  {
    id: "wellness",
    title: "Daily Wellness",
    icon: Zap,
    gradient: "from-orange-500 to-pink-500",
    resources: [
      {
        id: "7",
        title: "Creating Healthy Habits",
        description: "Build sustainable routines that support your wellbeing.",
        type: "Guide",
        duration: "15 min",
        url: "https://www.alittlenutrition.com/sustainable-health-routines/",
      },
      {
        id: "8",
        title: "Sleep Hygiene Tips",
        description: "Improve your sleep quality for better mental health.",
        type: "Article",
        duration: "6 min read",
        url: "https://www.sleepfoundation.org/mental-health",
      },
      {
        id: "9",
        title: "Gratitude Practice",
        description: "Cultivate appreciation and positive thinking patterns.",
        type: "Exercise",
        duration: "5 min daily",
        url: "https://realitypathing.com/steps-to-cultivate-a-mindset-of-appreciation-and-positivity/",
      },
    ],
  },
  {
    id: "support",
    title: "Getting Support",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    resources: [
      {
        id: "10",
        title: "When to Seek Professional Help",
        description: "Understanding when it's time to reach out to a mental health professional.",
        type: "Article",
        duration: "10 min read",
        url: "https://recovered.org/blog/when-to-get-help-for-your-mental-health",
      },
      {
        id: "11",
        title: "Crisis Resources",
        description: "Important contacts and resources for mental health emergencies.",
        type: "Directory",
        duration: "Reference",
        url: "https://www.therapyroute.com/article/free-mental-health-resources-in-india-by-therapyroute",
      },
      {
        id: "12",
        title: "Building Your Support Network",
        description: "How to create and maintain meaningful connections.",
        type: "Guide",
        duration: "12 min",
        url: "https://www.forbes.com/sites/traversmark/article/3-practical-steps-for-creating-meaningful-connections-by-a-psychologist/",
      },
    ],
  },
]

export default function ResourcesPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
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
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-full p-2">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Wellness Resources</h1>
              <p className="text-sm text-gray-600">Tools and guides for your wellbeing journey</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Intro */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wellbeing Toolkit</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover evidence-based resources, tools, and techniques to support your mental health journey.
            </p>
          </motion.div>

          {/* Resource Categories */}
          <div className="space-y-12">
            {resourceCategories.map((category, categoryIndex) => (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`bg-gradient-to-r ${category.gradient} rounded-full p-3`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">{category.title}</h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      gradient={category.gradient}
                      index={resourceIndex}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
          >
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">Important Note</h4>
            <p className="text-yellow-700">
              These resources are for educational purposes and general wellbeing support. They are not a substitute for
              professional mental health treatment. If you're experiencing a mental health crisis, please contact a
              mental health professional or emergency services immediately.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
