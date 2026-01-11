import { apiClient, type RequestDataConfig } from '@/api/api'
import type { PaginatedSongsResponse } from '@/lib/types/common.type'
import type { Song } from '@/lib/types/song/song.type'

export const songsService = {
  /**
   * Get songs, with filters limit, page, artist
   * @param config
   * @returns Paginated Songs list
   */
  async getSongs(config?: Partial<RequestDataConfig>) {
    return await apiClient.get<PaginatedSongsResponse<Array<Song>>>({
      endpoint: `/songs/`,
      ...config,
    })
  },
}
