import type { RequestDataConfig } from '@/api/api'
import { handleRequest } from '@/api/api-wrapper'
import type { ApiResult, ApiStatus, UseApiResult } from '@/lib/types/api/api.type'
// import type { ResponseData } from '@/lib/types/common.type'
import { computed, onUnmounted, ref, type Ref } from 'vue'

export function useApi<T>(apiOptions: {
  dataFn: (config?: Partial<RequestDataConfig>) => Promise<ApiResult<T>>
}): UseApiResult<T> {
  const status = ref<ApiStatus>('idle')
  const error = ref<string | null>(null)
  const data = ref<T | null>(null) as Ref<T | null>

  const isIdle = computed(() => status.value === 'idle')
  const isLoading = computed(() => status.value === 'loading')
  const isError = computed(() => status.value === 'error')
  const isSuccess = computed(() => status.value === 'success')

  async function execute(config?: Partial<RequestDataConfig>): Promise<void> {
    data.value = null
    status.value = 'loading'
    const {
      payload: responseData,
      success,
      message,
    } = await handleRequest<T>(apiOptions.dataFn(config))
    if (!success) {
      error.value = message || 'Something went wrong'
      status.value = 'error'
      return
    }

    // Remove success and message dynamically
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { success: _s, message: _m, ...sanitized } = responseData as Record<string | 'data', unknown>
    data.value = {
      ...sanitized,
      data: sanitized.data,
    } as T
    status.value = 'success'
  }

  onUnmounted(() => {
    status.value = 'idle'
  })

  return {
    execute,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    data,
    error,
  }
}
