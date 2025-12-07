<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import type { PlayerValues, TimeCombo } from '@/lib/types/player.type';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Icon } from '@iconify/vue';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';


  const playerStore = usePlayerStore();

  const isPlaying = ref<boolean>(false);
  const interval = ref<number | undefined>();
  const playerValues = reactive<PlayerValues>({
    currentTime: { minutes: 0, seconds: 0 },
    duration: { minutes: 0, seconds: 0 },
  })

  const audioURL = computed(() => playerStore.audioURL);
  const audioTitle = computed(() => playerStore.title);
  const audioCoverImage = computed(() => playerStore.coverImage);
  const artistName = computed(() => playerStore.artistName);

  const audioRef = useTemplateRef('audio-ref');
  const progressRef = useTemplateRef('progress-ref');

  /**
   * First step - onloaded (watch only ONCE) - check
   * Second step - progress bar and song current time must be in sync when we play
   *  add an interval when it is playing. When paused clear interval - check
  */

  watch(audioURL, () => {
    if(audioRef && audioRef.value) {
      audioRef.value.onloadedmetadata = function() {

        const { minutes, seconds } = getAudioMinutes()

        playerValues.duration.minutes = minutes;
        playerValues.duration.seconds = seconds;

        if(progressRef && progressRef.value) {
          progressRef.value.value = audioRef.value?.currentTime.toString() as string
          progressRef.value.max = audioRef.value?.duration.toString() as string
          isPlaying.value = false;
        }
      }
    }
  }, { once: true });

  watch(isPlaying, (newVal, prevVal, onCleanup) => {

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

  function handleListenEnded() {
    if(audioRef && audioRef.value && progressRef && progressRef.value) {
      isPlaying.value = false;
    }
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
            <Button variants="ghost" class="rounded-full h-6 w-6 active:scale-90">
              <Icon icon="lucide:shuffle" />
            </Button>
            <Button variants="ghost" class="rounded-full h-6 w-6 active:scale-90">
              <Icon icon="lucide:skip-back" />
            </Button>
            <Button @click="handlePlayClick" variants="secondary" class="rounded-full h-12 w-12 active:scale-90">
              <Icon v-if="isPlaying" icon="lucide:pause" />
              <Icon v-else icon="lucide:play" />
            </Button>
            <Button variants="ghost" class="rounded-full h-6 w-6 active:scale-90">
              <Icon icon="lucide:skip-forward" />
            </Button>
            <Button variants="ghost" class="rounded-full h-6 w-6 active:scale-90">
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
