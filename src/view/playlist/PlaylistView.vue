<script setup lang="ts">
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import { useApi } from '@/composables/useApi';
import { playlistsService } from '@/features/playlists/services/playlits.services';
import type { PaginatedApiResponse } from '@/lib/types/common.type';
import { Icon } from '@iconify/vue';
import { onMounted } from 'vue';


const {
  data,
  execute,
  isLoading,
  isSuccess,
  isError,
  error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} = useApi<PaginatedApiResponse<any>>({
  dataFn: async(config) => await playlistsService.getPlaylists(config)
})

onMounted(async() => {
  await execute()
})

</script>

<template>
  <section class="w-full h-full p-6 md:p-8 overflow-y-auto">
    <!-- Header -->
    <div class="mb-8 animate-fade-in">
      <h1 class="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Your Playlists
      </h1>
      <p class="text-muted-foreground text-sm md:text-base">
        Create and manage your personal music collections
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      <BaseSkeleton
        v-for="i in 12"
        :key="i"
        class="h-48 md:h-56 rounded-xl animate-pulse"
      />
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div class="bg-destructive/10 p-6 rounded-full mb-4">
        <Icon icon="mdi:alert-circle-outline" class="w-16 h-16 text-destructive" />
      </div>
      <h3 class="text-xl font-semibold mb-2">Failed to load playlists</h3>
      <p class="text-muted-foreground text-center max-w-md mb-4">
        {{ typeof error === 'string' ? error : 'Something went wrong. Please try again.' }}
      </p>
      <button
        @click="() => execute()"
        class="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="isSuccess && (!data?.data || data.data.length === 0)" class="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div class="bg-primary/10 p-8 rounded-full mb-6">
        <Icon icon="mdi:playlist-music-outline" class="w-20 h-20 text-primary" />
      </div>
      <h3 class="text-2xl font-semibold mb-2">No playlists yet</h3>
      <p class="text-muted-foreground text-center max-w-md mb-6">
        Start building your music collection by creating your first playlist
      </p>
      <router-link
        to="/protected/playlist/create"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
      >
        <Icon icon="mdi:plus-circle-outline" class="w-5 h-5" />
        Create Playlist
      </router-link>
    </div>

    <!-- Playlists Grid -->
    <div v-else-if="isSuccess && data?.data" class="animate-fade-in">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <router-link
          v-for="playlist in data.data"
          :key="playlist._id"
          :to="`/protected/playlist/${playlist._id}`"
          class="group"
        >
          <div class="bg-card hover:bg-card/80 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
            <!-- Playlist Cover -->
            <div class="relative mb-4">
              <div class="aspect-square bg-linear-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                <img
                  v-if="playlist.coverImage"
                  :src="playlist.coverImage"
                  :alt="playlist.name"
                  class="w-full h-full object-cover transition-opacity duration-300"
                />
                <div v-else class="text-4xl md:text-5xl font-bold text-primary/60">
                  {{ playlist.name?.charAt(0)?.toUpperCase() || '♫' }}
                </div>
              </div>

              <!-- Play Button Overlay -->
              <div class="absolute bottom-2 right-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div class="bg-primary hover:bg-primary/90 rounded-full p-3 shadow-xl hover:scale-110 transition-all duration-200">
                  <Icon icon="mdi:play" class="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </div>

            <!-- Playlist Info -->
            <div class="space-y-1">
              <h3 class="font-semibold truncate text-sm md:text-base group-hover:text-primary transition-colors">
                {{ playlist.name }}
              </h3>
              <p class="text-xs text-muted-foreground truncate">
                <template v-if="playlist.songs?.length">
                  {{ playlist.songs.length }} {{ playlist.songs.length === 1 ? 'song' : 'songs' }}
                </template>
                <template v-else-if="playlist.songCount">
                  {{ playlist.songCount }} {{ playlist.songCount === 1 ? 'song' : 'songs' }}
                </template>
                <template v-else>
                  Empty playlist
                </template>
              </p>
              <p v-if="playlist.description" class="text-xs text-muted-foreground/80 truncate">
                {{ playlist.description }}
              </p>
            </div>
          </div>
        </router-link>
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
