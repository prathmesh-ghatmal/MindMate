// src/services/journalService.ts
import api from "@/api/axios"

interface JournalEntryInput {
  title: string
  description: string
  mood: number
  tags: string[]
}

export const createQuickJournalEntry = async ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  const response = await api.post("/journal/", { title, description })
  return response.data
}

export const getAllJournalEntries = async () => {
  const response = await api.get("/journal/")
  return response.data
}

export const createJournalEntry = async (entry:JournalEntryInput) => {
  const response = await api.post("/journal/", entry)
  return response.data
}

export const updateJournalEntry = async (entryId: string, updates: Partial<JournalEntryInput>) => {
  const response = await api.put(`/journal/${entryId}`, updates)
  return response.data
}
