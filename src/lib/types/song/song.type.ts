import type { ArtistSongReference } from '@/lib/types/artist.type'

export type Song = {
  // todo: Re-declare proper type
  _id: string
  artist: ArtistSongReference
  title: string
  coverImage: string
  genre: string
  likes: number
  isExplicit: boolean
  audioURL: string
  duration: number
  plays: number
}

export type SongSingleShowcase = Pick<
  Song,
  '_id' | 'title' | 'coverImage' | 'likes' | 'audioURL' | 'artist' | 'duration'
>

export type SongsShowcase = Array<SongSingleShowcase>
