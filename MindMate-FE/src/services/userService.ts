// src/services/authService.ts (or userService.ts)

import api from "@/api/axios"
import type { User } from "@/types/User"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function updateUserProfile(data: Partial<User>): Promise<User> {
  const res = await api.put(`${API_BASE_URL}/user/me`, data)
  return res.data // assuming backend returns { message, user }
}
