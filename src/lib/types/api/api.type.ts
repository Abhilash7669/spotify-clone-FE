import type { ApiResponse } from '@/api/api'
import type { Ref } from 'vue'

export type ApiResponseData<T> = {
  success: boolean
  title: string
  message: string
  data?: T
}

export type ApiResult<T> = ApiResponse<ApiResponseData<T>>

export type ApiRequestState = 'LOADING' | 'IDLE' | 'SUCCESS' | 'ERROR'

export type ApiSuccessState = Extract<ApiRequestState, 'SUCCESS'>
export type ApiErrorState = Extract<ApiRequestState, 'ERROR'>
export type ApiIdleState = Extract<ApiRequestState, 'IDLE'>
export type ApiLoadingState = Extract<ApiRequestState, 'LOADING'>

export type UseApiResult<T> = {
  SUCCESS: Ref<ApiSuccessState | null>
  ERROR: Ref<ApiErrorState | null>
  LOADING: Ref<ApiLoadingState | null>
  IDLE: Ref<ApiIdleState | null>
  error: Ref<string, string>
  status: Ref<number | null, number | null>
  data: Ref<T | null, T | null>
  execute: (promise: Promise<ApiResult<T>>) => Promise<void>
}
