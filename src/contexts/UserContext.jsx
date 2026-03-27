import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('og_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (user, token) => {
    setCurrentUser(user)
    localStorage.setItem('og_user', JSON.stringify(user))
    if (token) localStorage.setItem('og_token', token)
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('og_user')
    localStorage.removeItem('og_token')
  }

  const updateUser = (user) => {
    setCurrentUser(user)
    localStorage.setItem('og_user', JSON.stringify(user))
  }

  return (
    <UserContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useCurrentUser() {
  return useContext(UserContext)
}
