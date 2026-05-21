import type { ReactNode } from "react"
import { useState } from "react"
import { loginRequest } from "../services/authService"
import type { LoginResponse, LoginData } from "../services/authService"
import { AuthContext } from "./AuthContextObject"

interface AuthProviderProps {
  children: ReactNode
}

function getStoredUser(): LoginResponse["user"] | null {
  const storedUser = localStorage.getItem("user")

  if (!storedUser) {
    return
  }

  return JSON.parse(storedUser)
}

function getStoredToken(): string | null {
  const storedToken = localStorage.getItem("token")

  if (!storedToken) {
    return
  }

  return storedToken
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginResponse["user"] | null>(getStoredUser)
  const [token, setToken] = useState<string | null>(getStoredToken)

  const isAuthenticated = !!user && !!token

  const signIn = async (data: LoginData): Promise<void> => {
    const response = await loginRequest(data)

    localStorage.setItem("token", response.token)
    localStorage.setItem("user", JSON.stringify(response.user))

    setUser(response.user)
    setToken(response.token)
  }

  const logout = async (): Promise<void> => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        signIn,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )

}
