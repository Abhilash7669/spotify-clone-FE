import type { ApiResponse, RequestDataConfig } from '@/api/api'
// import type { ResponseData } from '@/lib/types/common.type'
import type { ComputedRef, Ref } from 'vue'

export type ApiResponseData<T> = {
  success: boolean
  title: string
  message: string
} & T

export type ApiResult<T> = ApiResponse<ApiResponseData<T>>

export type ApiStatus = 'idle' | 'loading' | 'error' | 'success'

export type UseApiResult<T> = {
  isIdle: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
  isError: ComputedRef<boolean>
  isSuccess: ComputedRef<boolean>
  error: Ref<string | null, string | null>
  data: Ref<T | null, T | null>
  execute: (config?: Partial<RequestDataConfig>) => Promise<void>
}
