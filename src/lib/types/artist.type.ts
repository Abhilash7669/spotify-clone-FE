export type Artist = {
  _id: string
  name: string
  bio?: string
  image: string
  songs: null // TODO: to be worked on later
  genres: Array<string>
  followers: number
  albums: null // TODO: to be worked on later
  isVerified: boolean
}

export type ArtistSingleShowcase = Pick<Artist, '_id' | 'name' | 'bio' | 'image'>

export type ArtistsShowcase = Array<ArtistSingleShowcase>

export type ArtistSongReference = Pick<Artist, '_id' | 'name'>
