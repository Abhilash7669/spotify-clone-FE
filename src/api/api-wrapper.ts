import { ApiError } from '@/api/api'
import type { ApiResult } from '@/lib/types/api/api.type'
import { AUTH_UTILS } from '@/utils/auth'
import { useRouter } from 'vue-router'

interface handleResponse<T> {
  payload: T | null
  status: number
  success: boolean
  message?: string | undefined
  error: ApiError | null
}

export async function handleRequest<T>(promise: Promise<ApiResult<T>>): Promise<handleResponse<T>> {
  const router = useRouter()
  try {
    const response = await promise
    /**
     * Unauthorized Guard Safe
     */
    if (response.status === 401) {
      AUTH_UTILS.removeToken()
      router.push('/login')
    }
    // pass
    return {
      payload: response.payload as T,
      error: null,
      status: response.status,
      success: response.payload.success,
      message: response.payload.message,
    }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        AUTH_UTILS.removeToken()
        router.push('/login')
      }
      return {
        payload: null,
        success: false,
        error: err,
        status: err.status,
        message: err.message || 'Something went wrong',
      }
    } else {
      return {
        payload: null,
        success: false,
        error: new ApiError('Unexpected Error', 500),
        status: 500,
        message: 'Unexpected Error',
      }
    }
  }
}
