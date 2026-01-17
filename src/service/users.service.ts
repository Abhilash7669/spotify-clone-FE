import { apiClient, type RequestDataConfig } from '@/api/api'

export const usersService = {
  /**
   * Fetches UsersLookups
   * @param config
   * @returns Users lookups
   */
  async getUsersLookups(config?: Partial<RequestDataConfig>) {
    return await apiClient.get<{ data: Array<{ _id: string; name: string }> }>({
      endpoint: '/users/lookups',
      ...config,
    })
  },
}
