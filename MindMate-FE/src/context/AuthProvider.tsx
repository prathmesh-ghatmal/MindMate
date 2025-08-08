// src/context/AuthProvider.tsx
import { createContext, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginSuccess, logout } from "@/redux/slices/authSlice"
import type { RootState, AppDispatch } from "@/redux/store"
import type { User } from "@/types/User"
import { fetchUserProfile, getGoogleAuthUrl, loginUser, registerUser } from "@/services/authService"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom" 


interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  socialLogin: (provider: string) => Promise<void>
  logout: () => void
  googlelogin: (access_token: string, refresh_token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
  const login = async (email: string, password: string) => {
    try {
      const { access_token, refresh_token } = await loginUser(email, password)
      console.log(access_token, refresh_token)
      if (access_token && refresh_token) {
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("refresh_token", refresh_token)

        // fetchUserProfile uses token from interceptor
        const userProfile = await fetchUserProfile()
        const user = {
          ...userProfile,
          access_token,
          refresh_token,
        }

        dispatch(loginSuccess(user))
        toast.success("Login successful!")
      } else {
        console.error("Access token is missing.")
        toast.error("Unexpected error during login. Try again.")
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
     try {
      console.log(provider)
      const {auth_url} = await getGoogleAuthUrl(  );
      window.location.href = auth_url;
    } catch (err) {
      console.error("Failed to get auth URL", err);
    }
    // Mock logic only unless backend OAuth is implemented
    // const mockUser: User = {
    //   id: "social-1",
    //   email: `user@${provider}.com`,
    //   is_verified: true,
    //   first_name: `${provider}User`,
    // }
    // dispatch(loginSuccess(mockUser))
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    dispatch(logout())
    navigate("/")
    toast.success("Logged out successfully.")
  }

  const googlelogin = async (access_token: string, refresh_token: string) => {
    try {
      
      console.log(access_token, refresh_token)
      if (access_token && refresh_token) {
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("refresh_token", refresh_token)

        // fetchUserProfile uses token from interceptor
        const userProfile = await fetchUserProfile()
        const user = {
          ...userProfile,
          access_token,
          refresh_token,
        }

        dispatch(loginSuccess(user))
        toast.success("Login successful!")
      } else {
        console.error("Access token is missing.")
        toast.error("Unexpected error during login. Try again.")
      }
    } catch (err: any) {
      if (err?.response?.status === 403 && err?.response?.data?.detail === "Please verify your email first") {
        toast.error("Please verify your email before logging in.")
      } else {
        toast.error("Login failed. Please check your credentials.")
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, socialLogin, logout: handleLogout,googlelogin }}>
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

