export type LoginResponse = {
  success: boolean
  message: string
  token: string
  userId: string
  isAdmin: boolean
  profilePicture: string
}

export type LoginDTO = {
  email: string;
  password: string;
}
