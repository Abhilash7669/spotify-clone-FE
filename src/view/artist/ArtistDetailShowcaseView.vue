<script setup lang="ts">
import BasePagination from '@/components/BasePagination.vue';
import BaseArtistCard from '@/components/cards/BaseArtistCard.vue';
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import ShowcaseTemplate from '@/components/template/ShowcaseTemplate.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { PAGINATION_UTILS } from '@/lib/types/data/pagination.data';
import { computed, onUnmounted, ref } from 'vue';

/**
 * query params refs
 */
const limit = ref<number>(PAGINATION_UTILS.itemsPerPage.default);
const search = ref<string>('');
const pages = ref<number>(0)
const page = ref<number>(PAGINATION_UTILS.page.default)
const hasNext = ref<boolean>(false)
const hasPrev = ref<boolean>(false)

const hasPagination = computed(() => totalArtist.value && totalArtist.value > 10)

const totalArtist = ref<number | undefined>(undefined)
const currentPageArtistsCount = ref<number | undefined>(undefined)

const timer = ref<number | undefined>(undefined)

function getArtistPageMeta(artistCount: { totalCount: number, currentCount: number, pages: number, page: number, hasNext: boolean, hasPrev: boolean}) {
  totalArtist.value = artistCount.totalCount
  currentPageArtistsCount.value = artistCount.currentCount
  pages.value = artistCount.pages
  page.value = artistCount.page
  hasNext.value = artistCount.hasNext
  hasPrev.value = artistCount.hasPrev
}

function handleDebouncedSearch(artistName: string) {

  if(timer.value) clearTimeout(timer.value)

  timer.value = setTimeout(() => {
    search.value = artistName
  }, 400);

}

function handleClearSearch() {
  search.value = ''
}
function handleChangeLimit(value: number) {
  limit.value = value;
  page.value = PAGINATION_UTILS.page.default;
}

function handleNext() {
  if(hasNext.value && page.value) {
    page.value +=1
  }
}

function handlePrev() {
  if(hasPrev.value && page.value && page.value !== 1) {
    page.value--
  }
}

// handling timer cleanup
onUnmounted(() => {
  if(timer.value) clearTimeout(timer.value)
})


</script>
<template>
  <section class="p-6">
    <div class="space-y-2">
      <h2 class="text-4xl font-bold">
        All Artists
      </h2>
      <!-- artist count -->
      <p>
        <span v-if="totalArtist">
          {{ totalArtist }} artists total
        </span>
        <span v-if="totalArtist === 0">
          No artists found
        </span>
        <BaseSkeleton
          v-if="totalArtist === undefined"
          class="w-32 h-6"
        />
      </p>
    </div>
    <!-- input control -->
    <div class="flex items-center gap-2 mt-6 w-full">
      <Input
        :modal-value="search"
        @update="($event) => handleDebouncedSearch($event as string)"
        placeholder="Search artist"
        class="w-56 caret-amber-400"
        id="search"
      />
      <Button variants="secondary" @click="handleClearSearch" v-if="search">
        Clear
      </Button>
    </div>
    <!-- @vue-generic {import('@/lib/types/artist.type').ArtistsShowcase} -->
   <ShowcaseTemplate
    :api-options="{ endpoint: '/artists'}"
    v-slot="{ items }"
    :limit="limit"
    :search="search"
    :page="page"
    mode="detail"
    @artist-count="getArtistPageMeta"
   >
    <BaseArtistCard
      v-for="artist in items"
      :key="artist._id"
      :artist-card-data="artist"
    />
    </ShowcaseTemplate>
    <!-- pagination control -->
     <div v-if="hasPagination">
      <BasePagination
        :has-next="hasNext"
        :has-prev="hasPrev"
        :page="page"
        :pages="pages"
        :limit="limit"
        @limit-select="handleChangeLimit"
        @next-click="handleNext"
        @prev-click="handlePrev"
      />
     </div>
  </section>
</template>
