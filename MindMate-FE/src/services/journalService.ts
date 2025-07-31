// src/services/journalService.ts
import api from "@/api/axios"

export const createJournalEntry = async ({
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
