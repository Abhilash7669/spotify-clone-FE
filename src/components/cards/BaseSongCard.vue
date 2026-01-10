<script setup lang="ts">
import type { SelectedSong } from '@/lib/types/player.type';
import type { SongSingleShowcase } from '@/lib/types/song/song.type';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Icon } from '@iconify/vue';
const props = defineProps<{
  cardData: SongSingleShowcase
}>()


const playerStore = usePlayerStore();


function handleSelectSong(selectedSong: SelectedSong) {
  playerStore.handleInsertSingleSong(selectedSong)
}


</script>

<template>
  <div
    @click="() => handleSelectSong({
      audioURL: props.cardData.audioURL,
      title: props.cardData.title,
      coverImage: props.cardData.coverImage,
      artistName: props.cardData.artist.name,
      id: props.cardData._id
    })"
  >
  <div class="group relative bg-card hover:bg-card/80 rounded-lg p-4 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in">
    <div class="relative mb-4">
      <div class="aspect-square bg-muted rounded-md overflow-hidden shadow-lg flex items-center justify-center">
          <img
            v-if="props.cardData.coverImage"
            :src="props.cardData.coverImage"
            class="w-full h-full object-cover transition-opacity duration-300"
          />
          <span v-else>
            {{ props.cardData.title.split(" ").map(n => n[0]).join('') || 'A' }}
          </span>
      </div>
      <!-- place icon here -->
       <Icon icon="streamline-ultimate:button-play-bold" class="absolute flex bottom-1/4 right-2/4 translate-x-2/4 translate-y-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-xl opacity-0 group-hover:opacity-100 group-hover:bottom-2/4 group-hover:translate-y-2/4 transition-all duration-300 active:scale-95" />
    </div>

    <div class="space-y-1">
      <h3 class="font-semibold truncate">{{ props.cardData.title }}</h3>
      <p class="text-xs text-muted-foreground truncate">Duration: {{ props.cardData.duration }}</p>
    </div>
  </div>
  </div>
</template>
