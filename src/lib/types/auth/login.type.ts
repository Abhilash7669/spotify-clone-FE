
export type CommonApiResponse<T> = {
  success: boolean;
  message: string;
  data: T
}

export type LoginResponse = {
  token: string
  userId: string
  isAdmin: boolean
  profilePicture: string
}

export type LoginDTO = {
  email: string
  password: string
}
