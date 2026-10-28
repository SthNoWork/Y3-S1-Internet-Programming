import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type SessionUser = { id: number; name?: string; email: string; roleId: number }

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('paw_finder_token'))
  const user = ref<SessionUser | null>(JSON.parse(localStorage.getItem('paw_finder_user') ?? 'null'))
  const isLoggedIn = computed(() => Boolean(token.value))

  const saveSession = (newToken: string, newUser: SessionUser) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('paw_finder_token', newToken)
    localStorage.setItem('paw_finder_user', JSON.stringify(newUser))
  }

  const login = async (email: string, password: string) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error((await response.json()).message ?? 'Unable to log in')
    const result = await response.json()
    saveSession(result.accessToken, result.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }),
    })
    if (!response.ok) throw new Error((await response.json()).message ?? 'Unable to create account')
    await login(email, password)
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('paw_finder_token')
    localStorage.removeItem('paw_finder_user')
  }

  return { token, user, isLoggedIn, login, register, logout }
})
