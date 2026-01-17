<script setup lang="ts">
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import { useApi } from '@/composables/useApi';
import { playlistsService } from '@/features/playlists/services/playlits.services';
import type { SelectedSong } from '@/lib/types/player.type';
import { usePlayerStore } from '@/store/usePlayerStore';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute()

const playerStore = usePlayerStore()

const { data, isLoading, isSuccess, execute, error, isError } = useApi({
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

</script>

<template>
  <section>
    <BaseSkeleton
      v-if="isLoading"
      class="h-12 w-full"
    />
    <div v-if="isSuccess && data">
      <ul>
        <li @click="() => handlePlaySong({artistName: song.artist.name, audioURL: song.audioURL, coverImage: song.coverImage, id: song._id, title: song.title})" :key="song._id" v-for="song in data.data.songs">
          {{ song.title }}
        </li>
      </ul>
    </div>
  </section>
</template>
