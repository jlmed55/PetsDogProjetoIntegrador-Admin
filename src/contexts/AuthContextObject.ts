import type { LoginResponse, LoginData } from "../services/authService"
import { createContext } from "react"

interface AuthContextData {
  user: LoginResponse["user"] | null
  token: string | null
  isAuthenticated: boolean
  signIn: (data: LoginData) => Promise<void>
  logout: () => Promise<void>
} 

export const AuthContext = createContext({} as AuthContextData)
