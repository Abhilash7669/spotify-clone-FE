<script setup lang="ts">
import { apiClient } from '@/api/api';
import BasePagination from '@/components/BasePagination.vue';
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import Input from '@/components/ui/input/Input.vue';
import { useApi } from '@/composables/useApi';
import { songsService } from '@/features/songs/service/songs.service';
import type { PaginatedSongsResponse } from '@/lib/types/common.type';
import { PAGINATION_UTILS } from '@/lib/types/data/pagination.data';
import type { SelectedSong } from '@/lib/types/player.type';
import type { Song } from '@/lib/types/song/song.type';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Icon } from '@iconify/vue';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

const paginationControls = reactive({
  page: PAGINATION_UTILS.page.default,
  limit: PAGINATION_UTILS.itemsPerPage.default,
  artist: '',
  search: ''
})

const totalSongs = ref<number | undefined>(undefined)
const pages = ref<number>(0)
const currentItemsCount = ref<number>(0)
const totalArtistsCount = ref<number>(0)
const hasNext = ref<boolean>(false)
const hasPrev = ref<boolean>(false)

const timer = ref<number | undefined>(undefined)

const hasPagination = computed(() => totalSongs.value && totalSongs.value > 10);

const playerStore = usePlayerStore();

const {
  execute,
  data,
  isLoading,
  isSuccess,
  isError,
  error
} = useApi<PaginatedSongsResponse<Array<Song>>>({
  dataFn: async(config) => (
    await songsService.getSongs(config)
  )
})


const {
  data: artistLookupsData,
  isLoading: isArtistLookupsLoading,
  isSuccess: isArtistLookupsSuccess,
  execute: executeArtistsLookups,
  isError: isArtistLookupsError,
  error: artistLookupsError
} = useApi<{ data: Array<{ _id: string, name: string}> }>({
  dataFn: async () => await apiClient.get({
    endpoint: '/artists/lookups'
  })
})

// extract data into computed
const songsComputedData = computed(() => {
  if(data.value) {
    getPaginationData({
      currentCount: data.value.currentItemsInPage,
      hasNext: data.value.hasNext,
      hasPrev: data.value.hasPrev,
      page: data.value.page,
      pages: data.value.pages,
      totalCount: data.value.totalCount,
      artistTotalCount: data.value.artistTotalCount
    })
  }
  return data.value
})

const artistLookups = computed(() => {
  if(artistLookupsData.value?.data) {
    return {
      data: [{ _id: '', name: 'All Artists' }, ...artistLookupsData.value.data]
    }
  }
  return null
})

onMounted(async () => {
  Promise.all([execute({ urlParams: {
    artist: paginationControls.artist,
    limit: paginationControls.limit.toString(),
    page: paginationControls.page.toString()
  }}), executeArtistsLookups()])
})

watch(paginationControls, async () => {
  await execute({ urlParams: {
    artist: paginationControls.artist,
    limit: paginationControls.limit.toString(),
    page: paginationControls.page.toString(),
    search: paginationControls.search
  }})

})

function handlePlaySong(selectedSong: Song) {
  const song: SelectedSong = {
    artistName: selectedSong.artist.name,
    audioURL: selectedSong.audioURL,
    coverImage: selectedSong.coverImage,
    title: selectedSong.title,
    id: selectedSong._id
  }
  playerStore.handleInsertSingleSong(song)
}

/**
 * handles debounced search api call
 * @param value
 */
function handleDebouncedSearch(value: string) {
  if(timer.value) clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    paginationControls.search = value
    paginationControls.page = PAGINATION_UTILS.page.default
  }, 400);
}

function handleChangeArtist(value: string) {
  paginationControls.artist = value
  paginationControls.page = PAGINATION_UTILS.page.default
}

function handleChangeLimit(value: number) {
  paginationControls.limit = value
  paginationControls.page = PAGINATION_UTILS.page.default
}

function handleNext() {
  if(hasNext.value && paginationControls.page) {
    paginationControls.page += 1
  }
}

function handlePrev() {
  if(hasPrev.value && paginationControls.page !== 1) {
    paginationControls.page -= 1
  }
}

function getPaginationData(pagedData: { totalCount: number, currentCount: number, pages: number, page: number, hasNext: boolean, hasPrev: boolean, artistTotalCount: number}) {
  totalSongs.value = pagedData.totalCount
  currentItemsCount.value = pagedData.currentCount
  pages.value = pagedData.pages
  paginationControls.page = pagedData.page
  hasNext.value = pagedData.hasNext
  hasPrev.value = pagedData.hasPrev
  totalArtistsCount.value = pagedData.artistTotalCount
}

/**
 * Clean up function for timer
 */
onUnmounted(() => {
  if(timer.value) clearTimeout(timer.value)
})

</script>

<template>

  <div v-if="isError && error">
    <p class="text-red-500">
      {{ error }}
    </p>
  </div>
  <main  class="h-full p-4 space-y-4">
    <!-- title/infos -->
    <div class="space-y-1">
      <h2 class="text-4xl font-bold">
        All Songs
      </h2>
      <BaseSkeleton class="w-32 h-6" v-if="isLoading" />
      <p v-else class="text-sm text-muted-foreground">
        Browse {{ totalSongs }} songs from {{ totalArtistsCount }} artists
      </p>
    </div>
    <div>
      <div class="rounded-2xl border border-border/30 p-4 bg-linear-to-br from-card/50 to-card/20 flex items-center gap-12">
        <!-- search songs input -->
        <Input
          placeholder="Search songs"
          class="w-56 caret-amber-400"
          id="search"
          :modal-value="paginationControls.search"
          @update="$event => handleDebouncedSearch($event as string)"
        />
        <!-- artist lookups -->
         <div v-if="isArtistLookupsSuccess && artistLookups">
           <div class="w-fit relative">
              <select
                 class="bg-background/50 text-sm font-semibold text-foreground appearance-none cursor-pointer
                     px-4 py-2 rounded-lg border border-border
                     shadow-sm hover:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-primary/50
                     transition w-auto"
                     :value="paginationControls.artist"
                     v-on:change="$event => handleChangeArtist(($event.target as HTMLSelectElement).value)"
               >
                 <option
                   v-for="value in artistLookups.data"
                   :key="value._id"
                   :value="value._id"
                 >
                   {{ value.name }}
                 </option>
               </select>
               <Icon class="absolute top-2/4 -translate-y-2/4 right-1" icon="lucide:chevron-down" height="12" width="12" />
           </div>
         </div>
         <!-- aritst lookups error -->
          <div v-if="isArtistLookupsError && artistLookupsError">
            <p class="text-red-500">
              {{ artistLookupsError }}
            </p>
          </div>
        <div v-if="isArtistLookupsLoading">
          <BaseSkeleton class="w-12" />
        </div>
      </div>
    </div>

    <!-- Initial table loader -->
    <div v-if="isLoading" class="w-full space-y-6 animate-pulse">
      <!-- Table Container -->
      <div class="rounded-xl border bg-background overflow-hidden">
        <!-- Table Header -->
        <div class="grid grid-cols-5 gap-4 px-6 py-4 bg-muted/40">
          <BaseSkeleton class="h-4 w-16 rounded" />
          <BaseSkeleton class="h-4 w-32 rounded" />
          <BaseSkeleton class="h-4 w-20 rounded" />
          <BaseSkeleton class="h-4 w-20 rounded" />
          <BaseSkeleton class="h-4 w-16 rounded" />
        </div>

        <!-- Table Rows -->
        <div
          v-for="row in 6"
          :key="row"
          class="grid grid-cols-5 gap-4 px-6 py-4 items-center border-t"
        >
          <BaseSkeleton class="h-5 w-12 rounded-md" />
          <BaseSkeleton class="h-5 w-40 rounded-md" />
          <BaseSkeleton class="h-5 w-24 rounded-md" />
          <BaseSkeleton class="h-5 w-20 rounded-md" />
          <BaseSkeleton class="h-5 w-16 rounded-md" />
        </div>
      </div>
    </div>

    <!-- song table -->
     <div v-if="isSuccess && songsComputedData && songsComputedData.data">
       <table class="border border-collapse rounded-2xl overflow-hidden">
         <thead class="text-left backdrop-blur-lg bg-secondary/30">
           <tr class="text-sm text-muted-foreground">
             <th class="px-4 py-2" scope="col">
               #
             </th>
             <th class="px-4 py-2 tracking-wider" scope="col">
               Title
             </th>
             <th class="px-4 py-2 tracking-wider" scope="col">
               Artist
             </th>
             <th class="px-4 py-2 tracking-wider" scope="col">
               Duration
             </th>
           </tr>
         </thead>
         <tbody>
           <tr
              @click="() => handlePlaySong(value)"
              v-for="(value, i) in songsComputedData.data"
              :key="value._id"
              class="border-b hover:bg-secondary/20 duration-300 transition-colors cursor-pointer text-base"
            >
             <td class="px-4 py-2">
               {{ (paginationControls.page - 1) * paginationControls.limit + i + 1 }}
             </td>
             <td class="px-4 py-2">{{ value.title }}</td>
             <td class="px-4 py-2">{{ value.artist.name }}</td>
             <td class="px-4 py-2">{{ value.duration }}</td>
           </tr>
         </tbody>
       </table>
     </div>
    <div v-if="hasPagination">
      <BasePagination
        :limit="paginationControls.limit"
        :has-next="hasNext"
        :has-prev="hasPrev"
        :page="paginationControls.page"
        :pages="pages"
        @limit-select="handleChangeLimit"
        @next-click="handleNext"
        @prev-click="handlePrev"
      />
    </div>
  </main>
</template>

<style scoped>
  table {
    width: 100%;
  }
  td {
    text-align: left;
  }
</style>
