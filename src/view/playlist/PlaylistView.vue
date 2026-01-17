<script setup lang="ts">
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import { useApi } from '@/composables/useApi';
import { playlistsService } from '@/features/playlists/services/playlits.services';
import type { PaginatedApiResponse } from '@/lib/types/common.type';
import { onMounted } from 'vue';


const {
  data,
  execute,
  isLoading,
  isSuccess,
  isError,
  error
} = useApi<PaginatedApiResponse<unknown>>({
  dataFn: async(config) => await playlistsService.getPlaylists(config)
})

onMounted(async() => {
  await execute()
})

</script>

<template>
  <section>
    <BaseSkeleton
      v-if="isLoading"
      class="h-12 w-full"
    />
    <div v-if="isSuccess && data?.data">
      <ul>
        <li :key="playlist._id" v-for="playlist in data.data">
          <router-link :to="`/protected/playlist/${playlist._id}`">
            {{ playlist.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>
