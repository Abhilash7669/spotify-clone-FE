import { apiClient, type RequestDataConfig } from "@/api/api";


export const playlistsService = {

  /**
   * Create a playlist
   * @param config
   * @returns created playlist
   */
  async createPlaylist(config?: Partial<RequestDataConfig>) {
    return await apiClient.post({
      endpoint: `/playlists/`,
      ...config
    })
  }
}
