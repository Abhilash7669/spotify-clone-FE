import { handleRequest } from '@/api/api-wrapper'
import type {
  ApiErrorState,
  ApiIdleState,
  ApiLoadingState,
  ApiResult,
  ApiSuccessState,
  UseApiResult,
} from '@/lib/types/api/api.type'
import { onUnmounted, ref, type Ref } from 'vue'

export function useApi<T>(): UseApiResult<T> {
  const status = ref<number | null>(null)
  const error = ref<string>('')
  const toastMessage = ref<string>('')
  const data = ref<T | null>(null) as Ref<T | null>

  const SUCCESS = ref<ApiSuccessState | null>(null)
  const IDLE = ref<ApiIdleState | null>('IDLE')
  const LOADING = ref<ApiLoadingState | null>(null)
  const ERROR = ref<ApiErrorState | null>(null)

  async function execute(promise: Promise<ApiResult<T>>): Promise<void> {
    LOADING.value = 'LOADING'
    IDLE.value = null
    data.value = null
    const {
      data: responseData,
      status: responseStatus,
      error: responseError,
      success,
      message,
    } = await handleRequest<T>(promise)
    console.log(responseError, "RESPONSE ERROR");
    if (!success) {
      error.value = responseError?.message || 'Something went wrong'
      ERROR.value = 'ERROR'
    }

    if (success) {
      toastMessage.value = message || ''
      SUCCESS.value = 'SUCCESS'
      data.value = responseData
    }
    LOADING.value = null
    status.value = responseStatus
  }

  onUnmounted(() => {
    SUCCESS.value = null
    LOADING.value = null
    ERROR.value = null
    IDLE.value = 'IDLE'
  })

  return {
    execute,
    ERROR,
    LOADING,
    IDLE,
    SUCCESS,
    error,
    status,
    data,
  }
}
