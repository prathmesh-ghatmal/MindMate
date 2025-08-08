// src/services/authService.ts
import api from "@/api/axios"; 
import type { User } from "@/types/User"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function loginUser(email: string, password: string): Promise<User> {
  const response = await api.post(`${API_BASE_URL}/auth/login`, {
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
  const response = await api.post(`${API_BASE_URL}/auth/register`, {
    email,
    password,
    first_name,
    last_name: "", // optional or prompt user if needed
  })

  return response.data.user
}

export const fetchUserProfile = async () => {
  const res = await api.get(`${API_BASE_URL}/user/me`)
  return res.data
  
}

export async function getGoogleAuthUrl(): Promise<{ auth_url: string }> {
  const response = await api.get(`${API_BASE_URL}/auth/google-login`)
  console.log(response.data)
  return response.data
}

export async function handleGoogleCallback(code: string) {
  const response = await api.get(`${API_BASE_URL}/auth/google/callback`, {
    params: { code }
  })
  return response.data
}
