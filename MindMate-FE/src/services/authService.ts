// src/services/authService.ts
import axios from "axios"
import type { User } from "@/types/User"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function loginUser(email: string, password: string): Promise<User> {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  })
  return response.data // or adjust if your backend wraps this differently
}

export async function registerUser(
  email: string,
  password: string,
  first_name: string
): Promise<User> {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    email,
    password,
    first_name,
    last_name: "", // optional or prompt user if needed
  })

  return response.data.user
}

export const fetchUserProfile = async (token: string) => {
  const res = await axios.get(`${API_BASE_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}