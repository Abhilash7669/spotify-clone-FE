export type TimeCombo = {
  minutes: number
  seconds: number
}

export type PlayerValues = {
  duration: TimeCombo
  currentTime: TimeCombo
}

export type SongQueue = Array<SelectedSong>

export type SelectedSong = {
  id: string
  audioURL: string
  title: string
  artistName: string
  coverImage: string
}

export type PlayerStates = Record<PlayerOptions, boolean>

export type PlayerOptions = 'shuffle' | 'loop'
