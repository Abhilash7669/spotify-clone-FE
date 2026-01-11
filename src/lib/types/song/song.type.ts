import type { ArtistSongReference } from '@/lib/types/artist.type'

export type Song = {
  // todo: Re-declare proper type
  _id: string
  artist: ArtistSongReference
  audioURL: string
  coverImage: string
  duration: number
  isExplicit: boolean
  likes: number
  plays: number
  releaseDate: string
  title: string
}

export type SongSingleShowcase = Pick<
  Song,
  '_id' | 'title' | 'coverImage' | 'likes' | 'audioURL' | 'artist' | 'duration'
>

export type SongsShowcase = Array<SongSingleShowcase>
