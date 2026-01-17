import { apiClient, type RequestDataConfig } from '@/api/api'
import type { PaginatedApiResponse } from '@/lib/types/common.type'

export const playlistsService = {
  /**
   * Create a playlist
   * @param config
   * @returns created playlist
   */
  async createPlaylist(config?: Partial<RequestDataConfig>) {
    return await apiClient.post({
      endpoint: `/playlists/`,
      ...config,
    })
  },

  /**
   * Get a list of users playlist
   * @param config
   * @returns Users list of playlists
   */
  async getPlaylists(config?: Partial<RequestDataConfig>) {
    return await apiClient.get<PaginatedApiResponse<unknown>>({
      endpoint: '/playlists/me',
      ...config,
    })
  },

  /**
   * Gets a playlist
   * @param playlistId
   * @param config
   * @returns Single playlist
   */
  async getPlaylist(playlistId: string, config?: Partial<RequestDataConfig>) {
    return await apiClient.get({
      endpoint: `/playlists/${playlistId}`,
      ...config
    })
  },
}
