import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Heart, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import ChatMessage from "@/components/chat/chat-message"
import ChatInput from "@/components/chat/chat-input"
import SidebarChatHistory from "@/components/chat/SidebarChatHistory" // ✅ Your sidebar component
import { createConversation, deleteConversation, getAllConversations, renameConversation } from "@/services/conversationService"
import { exportConversationAsPDF, getMessages, sendMessage, type SendMessageRequest } from "@/services/chatService"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm MindMate, your wellbeing companion. I'm here to listen and support you. How are you feeling today?",
    role: "assistant",
    timestamp: new Date(Date.now() - 60000),
  },
]

export default function ChatPage() {
  const [currrentConversationId, setCurrentConversationId] = useState<string | null>(
  () => sessionStorage.getItem("conversationId")
)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showSidebar, setShowSidebar] = useState<boolean>(
  () => sessionStorage.getItem("showSidebar") === "true"
)
  const messagesEndRef = useRef<HTMLDivElement>(null)
 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
  if (currrentConversationId) {
    sessionStorage.setItem("conversationId", currrentConversationId)
  }
}, [currrentConversationId])

useEffect(() => {
  sessionStorage.setItem("showSidebar", showSidebar.toString())
}, [showSidebar])


  useEffect(() => {
  const create = async () => {
    try {
      const previosConversations = await getAllConversations()
      console.log(previosConversations)
      setConversations(previosConversations)
      if (previosConversations.length > 0) {
        const lastConversation = previosConversations[previosConversations.length - 1]
        setCurrentConversationId(lastConversation.id)
        sessionStorage.setItem("conversationId", lastConversation.id)
      } else {
        setCurrentConversationId(null)
      }
      if (!currrentConversationId) {
        console.log("No current conversation ID found, creating a new conversation")
      }else{
        const apiResponse = await getMessages(currrentConversationId)
         const formattedMessages: Message[] = apiResponse.map((msg) => ({
  ...msg,
  timestamp: new Date(msg.timestamp),
}));
    setMessages(formattedMessages)
    
      }
     
   
     
      // store response.id if needed
    } catch (error) {
      console.error("Failed to create conversation:", error)
    }
  }

  create()
}, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
  if (!content.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    role: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setIsTyping(true);

  let conversationId = currrentConversationId;

  // 👇 Lazy create conversation if needed
  if (!conversationId) {
    try {
      const newConversation = await createConversation(); // optionally pass content as initial message
      conversationId = newConversation.id;
      setCurrentConversationId(conversationId);
      setConversations((prev) => [...prev, newConversation]); // Update sidebar
    } catch (err) {
      console.error("Failed to create conversation", err);
      setIsTyping(false);
      return;
    }
  }

  const request: SendMessageRequest = {
    conversation_id: conversationId,
    message: content,
  };

  const assistantResponse = await sendMessage(request);

  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    content: assistantResponse.reply || generateBotResponse(),
    role: "assistant",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, assistantMessage]);
  setIsTyping(false);
};


  const generateBotResponse = (): string => {
    const responses = [
      "I hear you. It's completely normal to feel that way. Can you tell me more about what's on your mind?",
      "Thank you for sharing that with me. Your feelings are valid. What would help you feel better right now?",
      "That sounds challenging. Remember, you're not alone in this. What's one small thing that usually brings you comfort?",
      "I appreciate you opening up. It takes courage to share your feelings. How can I best support you today?",
      "Your wellbeing matters. What you're experiencing is important. Would you like to explore some coping strategies together?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Handlers for sidebar actions
  const handleConversationSelect = async(id: string) => {
    console.log("Selected conversation:", id) 
  
    const apiResponse = await getMessages(id)
   
    console.log("first api response:",apiResponse)
    
    const formattedMessages: Message[] = apiResponse.map((msg) => ({
  ...msg,
  timestamp: new Date(msg.timestamp),
}));
    setMessages(formattedMessages)
    setCurrentConversationId(id)
    // TODO: Load messages for selected conversation
  }

  const handleRenameConversation = async (id: string, newTitle: string) => {
  try {
    // Update in backend
    await renameConversation(id, newTitle)

    // Update in frontend
    setConversations((prev) =>
      prev.map((convo) =>
        convo.id === id ? { ...convo, title: newTitle } : convo
      )
    )
  } catch (err) {
    console.error("Failed to rename conversation:", err)
  }
}


  const handleDeleteConversation = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this conversation?")
    if (confirmDelete) {
      const deleteResponse = deleteConversation(id)
      console.log("Delete response:", deleteResponse)
      setConversations((prev) => prev.filter((convo) => convo.id !== id))
      if (currrentConversationId === id) {
        setMessages(initialMessages) // Reset messages if current conversation is deleted
        setCurrentConversationId(null)
        sessionStorage.removeItem("conversationId")
        console.log("Conversation deleted, resetting current conversation ID",sessionStorage.getItem("conversationId"))
        console.log("here is ",currrentConversationId)
      } 
      
  }
  }
  const handleShareConversation =async (id: string) => {
     try {
    const pdfBlob = await exportConversationAsPDF(id)

    const blobUrl = window.URL.createObjectURL(pdfBlob)

    const link = document.createElement("a")
    link.href = blobUrl
    link.download = `conversation_${id}.pdf`
    document.body.appendChild(link)
    link.click()

    // Clean up
    window.URL.revokeObjectURL(blobUrl)
    document.body.removeChild(link)
  } catch (err) {
    console.error("Failed to export PDF:", err)
    alert("Failed to download conversation as PDF.")
  }
  }

  return (
    
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 z-0">
      {/* Sidebar */}
        {showSidebar && (
     <motion.div
     className="fixed top-0 left-0 z-50"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
     >
            <SidebarChatHistory
            
              conversations={conversations}
              onSelect={handleConversationSelect}
              onRename={handleRenameConversation}
              onDelete={handleDeleteConversation}
              onShare={handleShareConversation}
            />
      </motion.div>
)}
  


      {/* Main Chat Area */}
     <div className={`flex-1 flex flex-col min-h-screen  ${
  showSidebar ? "ml-64 bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50" : ""
}`}>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          // className="bg-white/70 backdrop-blur-sm border-b border-white/20 p-4 "
           className={`fixed top-0 right-0 left-0 bg-white backdrop-blur-sm border-b border-white/20 p-4 z-50 ${
    showSidebar ? "ml-64" : "ml-0"
  }`}
        >
          <div className="container mx-auto flex items-center space-x-4">
            <Button
              className="fixed top-4 left-4 z-50 md:hidden"
              variant="ghost"
              size="icon"
            >
  
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)}>
             <Menu className="w-6 h-6 text-gray-700" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">MindMate</h1>
                <p className="text-sm text-gray-600">Your AI Wellbeing Companion</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-16 mt-16">
          <div className="container mx-auto max-w-4xl space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={message.id} message={message} isLast={index === messages.length - 1} />
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 flex-shrink-0">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 max-w-xs">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

            <div  className={`fixed bottom-0 right-0 left-0 ${
    showSidebar ? "ml-64" : "ml-0"
  }`}>
               {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
            </div>
       
      </div>
    </div>
  )
}
