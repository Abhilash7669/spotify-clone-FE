import { apiClient, type RequestDataConfig } from '@/api/api'
import type { FollowToggleDto, GetArtistDetailsDto } from '@/features/artist/types/artist.types'

/**
 * Artist service
 */
export const artistService = {
  /**
   *
   * @param artistId
   * @param config
   * @returns artist detail
   */
  async getArtist(artistId: string, config?: Partial<RequestDataConfig>) {
    return await apiClient.get<GetArtistDetailsDto>({
      endpoint: `/artists/${artistId}`,
      ...config,
    })
  },

  /**
   * Follow an artist
   * @param artistId
   * @param config
   */
  async followArtist(artistId: string, config?: Partial<RequestDataConfig>) {
    return await apiClient.put<{ data: FollowToggleDto }>({
      endpoint: `/artists/follow/${artistId}`,
      ...config,
    })
  },

  /**
   * Unfollow an artist
   * @param artistId
   * @param config
   * @returns
   */
  async unfollowArtist(artistId: string, config?: Partial<RequestDataConfig>) {
    return await apiClient.put<{ data: FollowToggleDto }>({
      endpoint: `/artists/unfollow/${artistId}`,
      ...config,
    })
  },
}
