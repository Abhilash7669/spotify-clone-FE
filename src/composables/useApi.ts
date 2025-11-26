import type { RequestDataConfig } from '@/api/api'
import { handleRequest } from '@/api/api-wrapper'
import type { ApiResult, ApiStatus, UseApiResult } from '@/lib/types/api/api.type'
import { computed, onUnmounted, ref, type Ref } from 'vue'

export function useApi<T, K>(apiOptions: {
  dataFn: (config?: Partial<RequestDataConfig>) => Promise<ApiResult<K>>
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
      data: responseData,
      success,
      message,
    } = await handleRequest<K>(apiOptions.dataFn(config))
    if (!success) {
      error.value = message || 'Something went wrong'
      status.value = 'error'
    }

    if (success) {
      data.value = responseData as T
      status.value = 'success'
    }
    console.log(responseData, 'IN COMPOSABLE')
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
