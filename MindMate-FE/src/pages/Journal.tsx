import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ArrowLeft, Plus, Calendar, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import JournalEntry from "@/components/journal/journal-entry"
import NewEntryModal from "@/components/journal/new-entry-modal"
import { getAllJournalEntries } from "@/services/journalService"

// Mock journal entries - to be replaced with backend integration
const mockEntries = [
  {
    id: "1",
    title: "A Beautiful Morning",
    content:
      "Today started with the most amazing sunrise. I took a moment to appreciate the simple beauty around me and felt grateful for this new day.",
    mood: { emoji: "😊", value: 4 },
    date: new Date(Date.now() - 86400000), // Yesterday
    tags: ["gratitude", "nature"],
  },
  {
    id: "2",
    title: "Overcoming Challenges",
    content:
      "Had a difficult conversation at work today, but I handled it with grace and patience. Proud of how I managed my emotions.",
    mood: { emoji: "😐", value: 3 },
    date: new Date(Date.now() - 172800000), // 2 days ago
    tags: ["work", "growth"],
  },
  {
    id: "3",
    title: "Family Time",
    content:
      "Spent the evening with family playing board games. These moments of connection and laughter are what life is all about.",
    mood: { emoji: "😄", value: 5 },
    date: new Date(Date.now() - 259200000), // 3 days ago
    tags: ["family", "joy"],
  },
]

const moodEmojis = [
  { emoji: "😔", value: 1 },
  { emoji: "😐", value: 2 },
  { emoji: "😊", value: 3 },
  { emoji: "😁", value: 4 },
  { emoji: "🤩", value: 5 },
];

export default function JournalPage() {
  const [entries, setEntries] = useState(mockEntries)
  const [loading, setLoading] = useState(true)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
  const fetchEntries = async () => {
    try {
      const data = await getAllJournalEntries()
      console.log("theses are entries",data)
      const formattedEntries = data.map((entry: any) => {
  const moodIndex = entry.mood ? entry.mood - 1 : null;
  const mood =
    moodIndex !== null && moodEmojis[moodIndex]
      ? moodEmojis[moodIndex]
      : { emoji: "❓", value: 1 };

  return {
    id: entry.id,
    title: entry.title,
    content: entry.description,
    mood,
    date: new Date(entry.created_at),
    tags: entry.tags ?? [],
  };
});
setEntries(formattedEntries);
console.log("hello",formattedEntries)

     
    } catch (error) {
      console.error("Failed to fetch journal entries", error)
    } finally {
      setLoading(false)
    }
  }

  fetchEntries()
}, [])

  const handleNewEntry = (entry: any) => {
    // const newEntry = {
    //   id: Date.now().toString(),
    //   ...entry,
    //   date: new Date(),
    // }
    // setEntries((prev) => [newEntry, ...prev])
     window.location.reload();
  }
    if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div className="loader">Loading...</div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-sm border-b border-white/20 p-4"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full p-2">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">My Journal</h1>
                <p className="text-sm text-gray-600">{entries.length} entries</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setShowNewEntry(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </Button>
        </div>
      </motion.header>

      {/* Entries */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {entries.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Start Your Journey</h2>
              <p className="text-gray-600 mb-6">Your first journal entry is just a click away</p>
              <Button
                onClick={() => setShowNewEntry(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Write Your First Entry
              </Button>
            </motion.div>
          ) : (
            entries.map((entry, index) => <JournalEntry key={entry.id} entry={entry} index={index} />)
          )}
        </div>
      </div>

      <NewEntryModal isOpen={showNewEntry} onClose={() => setShowNewEntry(false)} onSave={handleNewEntry} />
    </div>
  )
}
