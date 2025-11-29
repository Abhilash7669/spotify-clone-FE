import type { AuthUser } from '@/lib/types/auth/user.type'

export type CommonApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type LoginResponse = AuthUser & {
  token: string
}

export type LoginDTO = {
  email: string
  password: string
}
