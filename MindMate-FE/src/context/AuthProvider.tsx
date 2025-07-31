// src/context/AuthProvider.tsx
import { createContext, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginSuccess, logout } from "@/redux/slices/authSlice"
import type { RootState, AppDispatch } from "@/redux/store"
import type { User } from "@/types/User"
import { fetchUserProfile, loginUser, registerUser } from "@/services/authService"
import { toast } from "react-hot-toast"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  socialLogin: (provider: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)

  const login = async (email: string, password: string) => {
  try {
    
    const { access_token, refresh_token } = await loginUser(email, password)
    if (access_token) {
      
  const userProfile = await fetchUserProfile(access_token);
  const user = {
      ...userProfile,
      access_token,
      refresh_token,
    }

    dispatch(loginSuccess(user))
    toast.success("Login successful!")
} else {
  // handle missing token case (e.g., throw error or redirect)
  console.error("Access token is missing.");
}

    
  } catch (err: any) {
    if (err?.response?.status === 403 && err?.response?.data?.detail === "Please verify your email first") {
      toast.error("Please verify your email before logging in.")
    } else {
      toast.error("Login failed. Please check your credentials.")
    }
  }
}


  const signup = async (email: string, password: string, name: string) => {
  try {
    await registerUser(email, password, name)
    toast.success("Registration successful! Please check your email to verify your account.")
  } catch (err: any) {
    if (
      err?.response?.status === 400 &&
      err?.response?.data?.detail === "Email already registered"
    ) {
      toast.error("This email is already registered. Please login or use another email.")
    } else {
      toast.error("Registration failed. Please try again.")
    }
  }
}

  const socialLogin = async (provider: string) => {
    // Still a mock — unless your backend has OAuth integration
    const mockUser: User = {
      id: "social-1",
      email: `user@${provider}.com`,
      is_verified: true,
      first_name: `${provider}User`,
    }
    dispatch(loginSuccess(mockUser))
  }

  const handleLogout = () => dispatch(logout())

  return (
    <AuthContext.Provider value={{ user, login, signup, socialLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
