import { VUE_CONFIG } from '@/config/config'
import type { ApiResponseData, ApiResult } from '@/lib/types/api/api.type'

interface ApiConfig {
  baseUrl: string
  defaultHeaders?: Record<string, string>
  timeout?: number
}

interface AuthConfig {
  tokenProvider?: () => Promise<string | null> | string | null
  tokenHeader?: string
  tokenPrefix?: string
}

interface RequestConfig {
  endpoint: string
  urlParams?: Record<string, string>
  options?: RequestInit
}

export interface RequestDataConfig<T = unknown> extends RequestConfig {
  data?: T
}

export interface ApiResponse<T> {
  payload: T
  status: number
  headers: Headers
}

export class ApiError extends Error {
  name: string

  constructor(
    message: string,
    public status: number,
    public response?: Response,
  ) {
    super(message)
    this.name = 'Api Error'
  }
}

class ApiClient {
  private config: Required<ApiConfig>
  private authConfig: AuthConfig
  constructor(config: ApiConfig, authConfig: AuthConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl,
      defaultHeaders: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
      timeout: config.timeout || 100000,
    }
    this.authConfig = {
      tokenHeader: 'Authorization',
      tokenPrefix: 'Bearer',
      ...authConfig,
    }
  }

  private async initRequest<T>(
    endpoint: string,
    options: RequestInit,
    data?: unknown,
  ): Promise<ApiResponse<ApiResponseData<T>>> {
    const url = this.buildUrl(endpoint)
    const requestOptions = await this.buildRequestOptions(options, data)

    try {
      const controller = new AbortController()
      const _timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const response = await fetch(url, { ...requestOptions, signal: controller.signal })

      clearTimeout(_timeoutId)

      // parse the response
      const data = await this.parseResponse<ApiResponseData<T>>(response)

      if (!response.ok || !data.success) {
        throw new ApiError(data.message || 'Something went wrong', response.status || 500)
      }

      return {
        payload: data as ApiResponseData<T>,
        headers: response.headers,
        status: response.status,
      }
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'AbortError') {
          throw new ApiError('Timed out', 403)
        } else {
          throw error
        }
      } else {
        throw error
      }
    }
  }

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) return endpoint
    return `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  }

  private async buildRequestOptions(options: RequestInit, data?: unknown): Promise<RequestInit> {
    const headers = { ...this.config.defaultHeaders }

    if (this.authConfig.tokenProvider) {
      const token = await this.authConfig.tokenProvider()
      if (token) {
        headers[this.authConfig.tokenHeader!] = `${this.authConfig.tokenPrefix} ${token}`
      }
    }

    let body: BodyInit | undefined

    if (data instanceof FormData) {
      body = data
      delete headers['Content-Type']
    } else if (data !== undefined) {
      body = JSON.stringify(data)
    }

    return {
      ...options,
      body,
      headers: {
        ...headers,
        ...options.headers,
      },
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const _contentType = response.headers.get('Content-Type')

    if (_contentType && _contentType.includes('application/json')) {
      try {
        return await response.json()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        throw new ApiError('Error parsing json', 403)
      }
    }

    return (await response.text()) as unknown as T
  }

  async get<T>(config: RequestConfig): Promise<ApiResult<T>> {

    let query: string | undefined;

    if(config.urlParams) {
      query = new URLSearchParams(config.urlParams).toString();
    }

    return this.initRequest(`${config.endpoint}?${query}`, { ...config.options, method: 'GET' })
  }

  async post<T>(config: RequestDataConfig): Promise<ApiResult<T>> {
    return this.initRequest(
      config.endpoint,
      {
        ...config.options,
        method: 'POST',
      },
      config.data,
    )
  }

  async put<T>(config: RequestDataConfig): Promise<ApiResult<T>> {
    return this.initRequest(
      config.endpoint,
      {
        ...config.options,
        method: 'PUT',
      },
      config.data,
    )
  }

  async patch<T>(config: RequestConfig): Promise<ApiResult<T>> {
    return this.initRequest(config.endpoint, {
      ...config.options,
      method: 'PATCH',
    })
  }

  async delete<T>(config: RequestDataConfig): Promise<ApiResult<T>> {
    return this.initRequest(config.endpoint, { ...config.options, method: 'DELETE' }, config.data)
  }
}

class TokenClass {
  getToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(VUE_CONFIG.TOKEN) ?? null
  }

  removeToken() {
    localStorage.removeItem(VUE_CONFIG.TOKEN)
  }
}

const token = new TokenClass()
export const apiClient = new ApiClient(
  { baseUrl: VUE_CONFIG.BASE_URL },
  { tokenProvider: token.getToken },
)
