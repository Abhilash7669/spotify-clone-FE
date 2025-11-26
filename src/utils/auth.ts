import { VUE_CONFIG } from '@/config/config'

export function getToken(): boolean {
  const token = localStorage.getItem(VUE_CONFIG.TOKEN)

  if (!token) return false

  return true
}

export function setToken(value: string) {
    localStorage.setItem(VUE_CONFIG.TOKEN, value);
}

export const AUTH_UTILS = {
  getToken,
  setToken
}
