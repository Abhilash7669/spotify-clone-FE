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

export interface ApiResponse<T> {
  data: T
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
  ): Promise<ApiResponse<ApiResponseData<T>>> {
    const url = this.buildUrl(endpoint)
    const requestOptions = await this.buildRequestOptions(options)

    try {
      const controller = new AbortController()
      const _timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const response = await fetch(url, { ...requestOptions, signal: controller.signal })

      clearTimeout(_timeoutId)

      // parse the response
      const data = await this.parseResponse<ApiResponseData<T>>(response)

      return {
        data,
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

  private async buildRequestOptions(options: RequestInit): Promise<RequestInit> {
    const headers = { ...this.config.defaultHeaders }

    if (this.authConfig.tokenProvider) {
      const token = await this.authConfig.tokenProvider()

      if (token) {
        headers[this.authConfig.tokenHeader!] = `${this.authConfig.tokenPrefix} ${token}`
      }
    }

    return {
      ...options,
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

  private jsonStringifyData(data: unknown): string {
    return JSON.stringify(data)
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
    return this.initRequest(endpoint, { ...options, method: 'GET' })
  }

  // endpoint: string, data?: unknown, options?: RequestInit

  async post<T>(config: {
    endpoint: string
    urlParams?: Record<string, string>
    data?: unknown
    options?: RequestInit
  }): Promise<ApiResult<T>> {
    return this.initRequest(config.endpoint, {
      ...config.options,
      body: config.data ? this.jsonStringifyData(config.data) : undefined,
      method: 'POST',
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResult<T>> {
    return this.initRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? this.jsonStringifyData(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResult<T>> {
    return this.initRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? this.jsonStringifyData(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResult<T>> {
    return this.initRequest(endpoint, { ...options, method: 'DELETE' })
  }
}

class TokenClass {
  token: string
  constructor(token: string) {
    this.token = token
  }

  getToken() {
    if (typeof window === 'undefined') return null

    return localStorage.getItem(this.token) ?? null
  }

  removeToken() {
    localStorage.removeItem(this.token)
  }
}

const token = new TokenClass(VUE_CONFIG.TOKEN)

export const apiClient = new ApiClient(
  { baseUrl: VUE_CONFIG.BASE_URL },
  { tokenProvider: token.getToken },
)
