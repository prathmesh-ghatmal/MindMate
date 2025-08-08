// src/services/moodService.ts
import api from "@/api/axios"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const createMoodLog = async (mood: number) => {
  const response = await api.post(`${API_BASE_URL}/mood/`, { mood })
  return response.data
}

export const getLatestMoodLog = async () => {
  const response = await api.get(`${API_BASE_URL}/mood/latest`)
  return response.data
}

export const getAllMoodLogs = async () => {
  const response = await api.get(`${API_BASE_URL}/mood/`)
  return response.data
}
