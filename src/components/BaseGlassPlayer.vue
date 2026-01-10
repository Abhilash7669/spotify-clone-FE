<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import type { PlayerOptions, PlayerStates, PlayerValues, TimeCombo } from '@/lib/types/player.type';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Icon } from '@iconify/vue';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';


  /**
   * Pinia store usePlayerStore
   * stores single
   */
  const playerStore = usePlayerStore();

  /**
   * Track song selection in the array
   */
  const songSelectionIndex = ref<number>(0);

  /**
   * Is Player in Play state
   */
  const isPlaying = ref<boolean>(false);

  /**
   * Interval to update current minutes of the song being played
   */
  const interval = ref<number | undefined>();


  /**
   * Declaring state of the glass player
   * configs - shuffle and loop
   */
  const playerStates = reactive<PlayerStates>({
    shuffle: false,
    loop: false
  })

  /**
   * Storing the current time of audio in play state
   * Displaying the total duration of the audio in play/pause/selected states
   */
  const playerValues = reactive<PlayerValues>({
    currentTime: { minutes: 0, seconds: 0 },
    duration: { minutes: 0, seconds: 0 },
  })

  /**
   * Computed values of selected song
   */
  const audioURL = computed(() => playerStore.songs[songSelectionIndex.value]?.audioURL);
  const audioTitle = computed(() => playerStore.songs[songSelectionIndex.value]?.title);
  const audioCoverImage = computed(() => playerStore.songs[songSelectionIndex.value]?.coverImage);
  const artistName = computed(() => playerStore.songs[songSelectionIndex.value]?.artistName);

  const audioRef = useTemplateRef('audio-ref');
  const progressRef = useTemplateRef('progress-ref');

  /**
   * First step - onloaded (watch only ONCE) - check
   * Second step - progress bar and song current time must be in sync when we play
   *  add an interval when it is playing. When paused clear interval - check
  */

  /**
   * 07/01/2026
   * !IMPORTANT - might re-consider to put songs in an array to be picked from by default (will be very helpful)
   * log note: Need to re-design and brain storm on adding event emitters to the glass player to handle multiple scenarios
   *  Consider to store multiple songs in an array and pick from as each song is completed, repeats until we reach the end of an array
   *  Scenarios storing song in array can be useful
   *    - playlists
   *    - queue
   *    - loop a song
   *  Can add custom events being emitted for the glass player to understand what to do next
   *  Also event listeners to control play/pause via keyboard
   * To be implemented.
   */


  /**
   * 08/01/2026
   * Implementing the above note
   * Scenario A - Initial Empty/No songs currently playinh
   *  - We push song into the array
   *  - We listen to the playerStore for changes in the player store
   *  - If subscriber notices a change by the publisher, glass player checks for TWO conditions
   *    - Is there a song currently playing or not
   *    - If yes, it keeps it and let's the current song play and listens for an event and picks the next song in the array
   *    - If no, it takes it and plays it
   */


  /**
   * Watch when audioURL is injected or selected by the user
   * note: changed to play by default on song being selected 07/01/2026
   */
  watch(audioURL, () => {
    handleInitPlayer()
  }, { once: true });

  /**
   * Track the play state of the player
   * Track if song was completed or paused by the user
   * watched on isPlaying variable being toggled
   */
  watch(isPlaying, (newVal, prevVal, onCleanup) => {
        console.log(playerStore.songs, 'SONGS')

    if(audioRef && audioRef.value && isPlaying.value === true) {

      interval.value = setInterval(() => {
        if(progressRef && progressRef.value) {
          const { minutes, seconds } = getAudioMinutes({ current: true })
          playerValues.currentTime.minutes = minutes;
          playerValues.currentTime.seconds = seconds;
          progressRef.value.value = audioRef.value?.currentTime.toString() as string
        }
      }, 500);

      audioRef.value.addEventListener('ended', handleListenEnded)

    } else {
      if(interval.value) {
        clearInterval(interval.value)
      };
      audioRef.value?.removeEventListener('ended', handleListenEnded);
    }

    onCleanup(() => {
      if(interval.value) clearInterval(interval.value);
      audioRef.value?.removeEventListener('ended', handleListenEnded);
    })

  })

  /**
   * Watches progress bar tick and updates the current time of the song
   */
  watch(progressRef, (newVal, prevVal, onCleanup) => {
    function onProgressChange() {
      if(audioRef && audioRef.value && progressRef && progressRef.value) {
        audioRef.value.currentTime = Number(progressRef.value.value) as number
      }
    }
    progressRef.value?.addEventListener('input', onProgressChange);

    onCleanup(() => {
      progressRef.value?.removeEventListener('input', onProgressChange);
    })

  })


  function handleInitPlayer() {
    if(audioRef && audioRef.value) {
      audioRef.value.onloadedmetadata = function() {

        const { minutes, seconds } = getAudioMinutes()

        playerValues.duration.minutes = minutes;
        playerValues.duration.seconds = seconds;

        if(progressRef && progressRef.value && audioRef.value) {
          audioRef.value.play();
          progressRef.value.value = audioRef.value?.currentTime.toString() as string
          progressRef.value.max = audioRef.value?.duration.toString() as string
          isPlaying.value = true;
        }
      }
    }
  }

  /**
   * Handle Play click
   */
  function handlePlayClick() {
    isPlaying.value = !isPlaying.value;

    if(audioRef && audioRef.value) {

      if(isPlaying.value) {
        audioRef.value.play();
      } else {
        audioRef.value.pause();
      }

    }

  }

  /**
   * Function to get the audio minutes of an audioURL
   * @param options
   */
  function getAudioMinutes(options?: { current: boolean}): TimeCombo {
    if(audioRef && audioRef.value) {
      const targetTime = options?.current ? audioRef.value!.currentTime :  audioRef.value!.duration
      const minutes = Math.floor(targetTime / 60)
      const seconds = Math.floor(targetTime % 60);

      return {
        minutes,
        seconds
      }
    }

    return {
      minutes: 0,
      seconds: 0
    }
  }

  /**
   * Handles scenario when and audioURL has completed
   */
  function handleListenEnded() {
    // todo: applied basic functionality, later refine the functionality of shuffle
    /**
     * Check the current song selection index is equal to the songs array length
     * if equal it has truly finished
     * else increment and play the next song
     */
    if(songSelectionIndex.value === (playerStore.songs.length - 1)) {

      // todo: need to refine the flow here for loop and shuffle
      if(playerStates.shuffle) {
        setRandomSongSelection()
        return;
      }
      // player state is in LOOP
      if(playerStates.loop) {
        songSelectionIndex.value = 0
        return;
      }
      // no conditions
      isPlaying.value = false;
      playerStore.clearSongsArray()
      songSelectionIndex.value = 0
    } else {
      if(playerStates.shuffle) {
        setRandomSongSelection()
        return;
      }
      songSelectionIndex.value += 1

    }
  }

  /**
   * Sets random array index value to choose a song on shuffle
   */
  function setRandomSongSelection() {
    const randomValue = Math.ceil(Math.random() * playerStore.songs.length)
    songSelectionIndex.value = randomValue
  }


  // todo: only implemented basic handleSkipNext and handleSkipPrevious, later refine it to handle edge cases and ui states
  /**
   * handle skip to the next song in the array
   */
  function handleSkipNext() {
    /**
     * Check current position
     */
    if(songSelectionIndex.value === (playerStore.songs.length - 1)) {
      // check if state is in loop
      if(playerStates.loop) songSelectionIndex.value = 0;
    } else {
      songSelectionIndex.value += 1;
    }
  }

  /**
   * handle skip to the previous song in the array
   */
  function handleSkipPrevious() {
    if(songSelectionIndex.value !== 0) {
      songSelectionIndex.value -= 1;
    }
  }

  /**
   * Function to update player state dynamically
   * @param key
   */
  function handleUpdatePlayerState(key: PlayerOptions) {
    playerStates[key] = !playerStates[key]
  }

</script>

<template>
  <div
      id="player-bar"
      ref="player-bar-ref"
      class="flex items-center justify-center w-full fixed bottom-0 left-0 h-24 bg-player border-t border-border backdrop-blur-lg"
    >
    <div class="h-full w-full px-4 flex items-center justify-between">
        <div class="flex items-center gap-4 w-[30%] min-w-[180px]">
          <div v-if="!audioCoverImage" class="h-14 w-14 bg-muted rounded-md shrink-0" />
          <div v-else class="h-14 w-14 rounded-md shrink-0">
            <img class="h-full w-full object-cover" :src="audioCoverImage" alt="cover image" />
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-sm truncate">{{ audioTitle }}</p>
            <p class="text-xs text-subdued truncate">{{ artistName }}</p>
          </div>
          <Icon icon="mdi:heart" width="24" height="24"  style="color: #5fbaff" />
          <!-- todo: modify heart svg as per song data -->
        </div>

        <!-- {/* Player Controls */} -->
        <div class="flex flex-col items-center gap-2 w-[40%] max-w-[722px]">
          <div class="flex items-center gap-4">
            <Button @click="() => handleUpdatePlayerState('shuffle')" variants="ghost" :class="`rounded-full h-8 w-8 active:scale-90 ${playerStates.shuffle ? 'bg-primary/90' : undefined}`">
              <Icon icon="lucide:shuffle" />
            </Button>
            <Button @click="handleSkipPrevious" variants="ghost" class="rounded-full h-8 w-8 active:scale-90">
              <Icon icon="lucide:skip-back" />
            </Button>
            <Button @click="handlePlayClick" variants="secondary" class="rounded-full h-12 w-12 active:scale-90">
              <Icon v-if="isPlaying" icon="lucide:pause" />
              <Icon v-else icon="lucide:play" />
            </Button>
            <Button @click="handleSkipNext" variants="ghost" class="rounded-full h-8 w-8 active:scale-90">
              <Icon icon="lucide:skip-forward" />
            </Button>
            <Button @click="() => handleUpdatePlayerState('loop')" variants="ghost" :class="`rounded-full h-8 w-8 active:scale-90 ${playerStates.loop ? 'bg-primary/90' : undefined}`">
              <Icon icon="lucide:repeat" />
            </Button>
          </div>

          <div class="flex items-center gap-2 w-full">
            <span class="text-xs text-subdued min-w-10 text-right">
              <!-- current time -->
               {{ playerValues.currentTime.minutes }}:{{ playerValues.currentTime.seconds }}
              </span>
              <div class="flex-1 relative group">
                <audio class="hidden" ref="audio-ref" controls :src="audioURL || ''">
                </audio>
                <input ref="progress-ref" type="range" class="w-full" value="0">
              </div>
              <!-- todo: total song duration -->
              <span class="text-xs text-subdued min-w-10">
              {{ playerValues.duration.minutes }}:{{ playerValues.duration.seconds }}
            </span>
          </div>
        </div>

        <!-- {/* Volume and Options */} -->
         <div class="flex items-center gap-2 justify-end w-[30%] min-w-[180px]">
          <Button variants="ghost" class="h-8 w-8 rounded-full">
            <Icon icon="lucide:volume-2" />
          </Button>
         </div>
      </div>
    </div>
</template>
