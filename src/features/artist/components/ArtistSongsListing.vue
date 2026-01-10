<script setup lang="ts">
import type { Song } from '@/lib/types/song/song.type';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  song: Song
  i: number
}>()
const emits = defineEmits<{
  handlePlaySong:[song: Song]
}>()

</script>

<template>
  <div
    @click="emits('handlePlaySong', props.song)"
    class="group flex items-center justify-between rounded-lg p-3 hover:bg-card/50 transition-colors cursor-pointer"
  >
    <div class="flex flex-1 items-center gap-2">
      <!-- {/* Track Number / Play Icon */} -->
      <div class="w-8 text-center">
        <span class="text-subdued group-hover:hidden">{{ props.i + 1 }}</span>
        <Icon class="hidden group-hover:flex" icon="lucide:play" width="24" height="24" />
      </div>

      <!-- {/* Song Info */} -->
      <div>
        <p class="font-medium truncate">{{ props.song.title }}</p>
      </div>
    </div>

    <!-- {/* Album */} -->
    <!-- <div class="hidden sm:block flex-1 min-w-0">
      <p class="text-subdued text-sm truncate">{song.album}</p>
    </div> -->

    <!-- {/* Plays */} -->
    <div class="hidden md:flex text-right flex-1">
      <p class="text-sm">{{ props.song.plays || 0 }} plays</p>
    </div>

    <!-- {/* Actions */} -->
    <div class="flex items-center gap-3">
      <Icon class="opacity-0 transition-opacity duration-300 group-hover:opacity-100" icon="mdi:heart" width="24" height="24"  style="color: #5fbaff" />
      <span class="text-subdued text-sm w-12 text-right">{{ props.song.duration }}</span>
    </div>
  </div>
</template>
