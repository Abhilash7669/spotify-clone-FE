import type { Song } from '@/lib/types/song/song.type'

export type GetArtistDetailsDto = {
  data: {
    albums: unknown[]
    bio: string
    createdAt: string
    followers: number
    genres: string[]
    image: string
    isVerified: boolean
    name: string
    songs: Song[]
    _id: string
    isFollowing: boolean
  }
}

export type LocalArtistData = {
  followers: number
  isFollowing: boolean
}

export type FollowToggleDto = {
  isFollowing: boolean
}
