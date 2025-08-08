// src/services/conversationService.ts
import api from "@/api/axios"

export interface Conversation {
  id: string
  title: string
}

export const getAllConversations = async (): Promise<Conversation[]> => {
  const response = await api.get("/conversations/")
  return response.data
}

export const createConversation = async (): Promise<Conversation> => {
  const response = await api.post("/conversations/")
  return response.data
}

export const renameConversation = async (
  conversationId: string,
  title: string
): Promise<{ message: string }> => {
  const response = await api.patch(`/conversations/${conversationId}`, null, {
    params: { title },
  })
  return response.data
}

export const deleteConversation = async (
  conversationId: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/conversations/${conversationId}`)
  return response.data
}
