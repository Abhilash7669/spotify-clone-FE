import type { SelectedSong, SongQueue } from '@/lib/types/player.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Pinia store state for usePlayerStore
 * stores the selected
 *  audioURL
 *  title
 *  coverImage
 *  artistName
 */
export const usePlayerStore = defineStore('player', () => {
  const audioURL = ref<string>('')
  const title = ref<string>('')
  const coverImage = ref<string>('')
  const artistName = ref<string>('')

  /**
   * Storing songs in array to be played in sequence
   */
  const songs = ref<SongQueue>([])

  /**
   * Function to handle selecting a single song
   * @behaviour - When a song is selected, songs array is cleared and push in the selected song
   */
  function handleInsertSingleSong(selectedSong: SelectedSong) {
    songs.value = [selectedSong]
  }

  /**
   * Function to push a bulk of songs into the array
   */
  function handleInsertBulkSongs(selectedSongs: Array<SelectedSong>) {
    songs.value = selectedSongs
  }

  function clearSongsArray() {
    songs.value = []
  }

  return {
    audioURL,
    title,
    coverImage,
    artistName,
    songs,
    handleInsertSingleSong,
    handleInsertBulkSongs,
    clearSongsArray,
  }
})
