import { VUE_CONFIG } from '@/config/config'

export function getToken(): boolean | string {
  const token = localStorage.getItem(VUE_CONFIG.TOKEN)

  if (!token) return false

  return token as string;
}

export function setToken(value: string) {
  localStorage.setItem(VUE_CONFIG.TOKEN, value)
}

export function removeToken(value?: string) {
  localStorage.removeItem(value ?? VUE_CONFIG.TOKEN)
}

export const AUTH_UTILS = {
  getToken,
  setToken,
  removeToken,
}
