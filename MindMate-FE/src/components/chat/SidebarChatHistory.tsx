import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { ScrollArea } from "../ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SidebarProps {
  conversations: { id: string; title: string }[]
  onSelect: (id: string) => void
  onRename: (id: string, newTitle: string) => void
  onDelete: (id: string) => void
  onShare: (id: string) => void
}

export default function Sidebar({
  conversations,
  onSelect,
  onRename,
  onDelete,
  onShare,
}: SidebarProps) {
  const navigate = useNavigate()

  // Modal state
  const [open, setOpen] = useState(false)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")

  const handleRenameClick = (id: string, currentTitle: string) => {
    setRenameId(id)
    setNewTitle(currentTitle)
    setOpen(true)
  }

  const handleRenameConfirm = () => {
    if (renameId && newTitle.trim()) {
      onRename(renameId, newTitle.trim())
      setOpen(false)
      setRenameId(null)
      setNewTitle("")
    }
  }

  return (
    <>
     <aside className="md:block w-full md:w-64 h-screen bg-white border-r flex flex-col">
  {/* Fixed Header */}
  <div className="flex items-center justify-evenly p-4 border-b">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className="bg-gray-100 text-black hover:bg-gray-300"
    >
      ←
    </Button>
    <h2 className="text-lg font-semibold text-gray-700">Your Conversations</h2>
  </div>

  {/* Scrollable conversation list */}
  <div className="flex-1 overflow-y-auto px-2 py-4">
    {conversations.map((convo) => (
      <div
        key={convo.id}
        className="flex justify-between items-center bg-white/60 hover:bg-purple-100 rounded-lg px-3 py-2 cursor-pointer"
        onClick={() => onSelect(convo.id)}
      >
        <span className="truncate text-gray-800">{convo.title}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
              className="hover:bg-gray-200"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleRenameClick(convo.id, convo.title)
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete(convo.id)
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onShare(convo.id)
              }}
            >
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ))}
  </div>
</aside>


      {/* Rename Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter new title"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm} disabled={!newTitle.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
