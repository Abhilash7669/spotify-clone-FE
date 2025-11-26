import { ApiError } from '@/api/api'
import type { ApiResult } from '@/lib/types/api/api.type'

interface handleResponse<T> {
  data: T | null
  status: number
  success: boolean
  message?: string | undefined
  error: ApiError | null
}

export async function handleRequest<T>(promise: Promise<ApiResult<T>>): Promise<handleResponse<T>> {
  try {
    const response = await promise
    console.log('HIT')
    return {
      data: response.data.data as T,
      error: null,
      status: response.status,
      success: response.data.success,
      message: response.data.message || undefined,
    }
  } catch (err) {
    if (err instanceof ApiError) {
      console.log(err, 'ERROR')
      return {
        data: null,
        success: false,
        error: err,
        status: err.status,
        message: err.message || 'Something went wrong',
      }
    } else {
      console.log(err, 'ERROR BN')
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
