import { ApiError } from '@/api/api'
import type { ApiResult } from '@/lib/types/api/api.type'
import { AUTH_UTILS } from '@/utils/auth'
import { useRouter } from 'vue-router'

interface handleResponse<T> {
  data: T | null
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
      data: response.data.data as T,
      error: null,
      status: response.status,
      success: response.data.success,
      message: response.data.message || undefined,
    }
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        data: null,
        success: false,
        error: err,
        status: err.status,
        message: err.message || 'Something went wrong',
      }
    } else {
      return {
        data: null,
        success: false,
        error: new ApiError('Unexpected Error', 500),
        status: 500,
        message: 'Unexpected Error',
      }
    }
  }
}
