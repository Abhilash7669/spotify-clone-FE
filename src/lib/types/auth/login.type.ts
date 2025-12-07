import type { AuthUser } from '@/lib/types/auth/user.type'

export type LoginResponse = AuthUser & {
  token: string
}

export type LoginDTO = {
  email: string
  password: string
}
