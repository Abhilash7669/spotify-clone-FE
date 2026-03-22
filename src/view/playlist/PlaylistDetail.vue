<script setup lang="ts">
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import { useApi } from '@/composables/useApi';
import { playlistsService } from '@/features/playlists/services/playlits.services';
import type { SelectedSong } from '@/lib/types/player.type';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()

const playerStore = usePlayerStore()
const hoveredSongId = ref<string | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { data, isLoading, isSuccess, execute, error, isError } = useApi<any>({
  dataFn: async(config) => await playlistsService.getPlaylist(route.params.id as string, config)
})

onMounted(async() => {
  await execute()
})

function handlePlaySong(selectedSong: SelectedSong) {
  const song: SelectedSong = {
    artistName: selectedSong.artistName,
    audioURL: selectedSong.audioURL,
    coverImage: selectedSong.coverImage,
    id: selectedSong.id,
    title: selectedSong.title
  }
  playerStore.handleInsertSingleSong(song)
}

function goBack() {
  router.back()
}

</script>

<template>
  <section class="w-full h-full overflow-y-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="p-6 md:p-8 space-y-6">
      <BaseSkeleton class="h-8 w-32 rounded-lg" />
      <div class="flex flex-col md:flex-row gap-6">
        <BaseSkeleton class="w-full md:w-64 h-64 rounded-xl" />
        <div class="flex-1 space-y-4">
          <BaseSkeleton class="h-12 w-3/4 rounded-lg" />
          <BaseSkeleton class="h-6 w-1/2 rounded-lg" />
        </div>
      </div>
      <div class="space-y-2">
        <BaseSkeleton v-for="i in 5" :key="i" class="h-16 w-full rounded-lg" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex flex-col items-center justify-center py-16 px-6">
      <div class="bg-destructive/10 p-6 rounded-full mb-4">
        <Icon icon="mdi:alert-circle-outline" class="w-16 h-16 text-destructive" />
      </div>
      <h3 class="text-xl font-semibold mb-2">Failed to load playlist</h3>
      <p class="text-muted-foreground text-center max-w-md mb-4">
        {{ typeof error === 'string' ? error : 'Something went wrong. Please try again.' }}
      </p>
      <div class="flex gap-3">
        <button
          @click="goBack"
          class="px-6 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all"
        >
          Go Back
        </button>
        <button
          @click="() => execute()"
          class="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Success State -->
    <div v-else-if="isSuccess && data?.data" class="p-6 md:p-8">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon icon="mdi:arrow-left" class="w-5 h-5" />
        <span>Back to Playlists</span>
      </button>

      <!-- Playlist Header -->
      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <!-- Cover Image -->
        <div class="w-full md:w-48 aspect-square bg-linear-to-br from-primary/30 via-purple-500/30 to-pink-500/30 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center shrink-0">
          <img
            v-if="data.data.coverImage"
            :src="data.data.coverImage"
            :alt="data.data.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="text-5xl font-bold text-primary">
            {{ data.data.name?.charAt(0)?.toUpperCase() || '♫' }}
          </div>
        </div>

        <!-- Playlist Info -->
        <div class="flex-1 space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Playlist</p>
          <h1 class="text-3xl md:text-4xl font-bold">
            {{ data.data.name }}
          </h1>
          <p v-if="data.data.description" class="text-sm text-muted-foreground">
            {{ data.data.description }}
          </p>
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span v-if="data.data.songs?.length">{{ data.data.songs.length }} {{ data.data.songs.length === 1 ? 'song' : 'songs' }}</span>
          </div>
        </div>
      </div>

      <!-- Songs List -->
      <div v-if="!data.data.songs || data.data.songs.length === 0" class="flex flex-col items-center justify-center py-12">
        <div class="bg-primary/10 p-6 rounded-full mb-4">
          <Icon icon="mdi:music-note-outline" class="w-12 h-12 text-primary" />
        </div>
        <h3 class="text-xl font-semibold mb-2">No songs in this playlist</h3>
        <p class="text-muted-foreground text-center">
          Start adding your favorite tracks
        </p>
      </div>

      <!-- Songs Table -->
      <div v-else class="space-y-1">
        <!-- Song Rows -->
        <div
          v-for="(song, index) in data.data.songs"
          :key="song._id"
          @click="() => handlePlaySong({
            artistName: song.artist?.name || 'Unknown',
            audioURL: song.audioURL,
            coverImage: song.coverImage,
            id: song._id,
            title: song.title
          })"
          @mouseenter="hoveredSongId = song._id"
          @mouseleave="hoveredSongId = null"
          class="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_2fr_1fr_auto] gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all group"
        >
          <!-- Index / Play Button -->
          <div class="flex items-center justify-center text-muted-foreground w-8">
            <span v-if="hoveredSongId !== song._id" class="text-sm">{{ Number(index) + 1 }}</span>
            <Icon v-else icon="mdi:play" class="w-5 h-5 text-primary" />
          </div>

          <!-- Song Info -->
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 bg-linear-to-br from-primary/20 to-purple-500/20 rounded overflow-hidden shrink-0">
              <img
                v-if="song.coverImage"
                :src="song.coverImage"
                :alt="song.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-primary">
                {{ song.title.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="min-w-0">
              <p class="font-medium truncate group-hover:text-primary transition-colors">
                {{ song.title }}
              </p>
              <p class="text-xs text-muted-foreground truncate">
                {{ song.artist?.name || 'Unknown Artist' }}
              </p>
            </div>
          </div>

          <!-- Artist (Hidden on mobile) -->
          <div class="hidden md:flex items-center text-sm text-muted-foreground truncate">
            {{ song.artist?.name || 'Unknown Artist' }}
          </div>

          <!-- Duration -->
          <div class="flex items-center justify-end text-sm text-muted-foreground">
            <span>{{ song.duration || '0:00' }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
