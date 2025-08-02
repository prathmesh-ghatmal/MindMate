// src/services/chatService.ts
import api from "@/api/axios"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface SendMessageRequest {
  conversation_id: string
  message: string
}

export const sendMessage = async (
  data: SendMessageRequest
): Promise<{ reply: string }> => {
  const response = await api.post("/chat/send", data)
  return response.data
}

export const getMessages = async (
  conversationId: string
): Promise<ChatMessage[]> => {
  const response = await api.get(`/chat/${conversationId}/messages`)
  return response.data
}

export const exportConversationAsPDF = async (
  conversationId: string
): Promise<Blob> => {
  const response = await api.get(`/chat/${conversationId}/export-pdf`, {
    responseType: "blob",
  })
  return response.data
}
